import getFileDateFromName from './utils/getFileDateFromName';
import getOSSClient from './utils/getOSSClient';
import isImageFilePath from './utils/isImageFilePath';
import fs from 'fs/promises';
import mkdir from './utils/mkdir';
import type OSS from 'ali-oss';
import type { Exif } from './exifs';
import * as Toml from '@ltd/j-toml';
import type {
	CaptionItem,
	Category,
	CategoryMeta,
	CityCategoryMeta,
	CollectionMeta,
	PhotoRecord,
	RegeoItem
} from '~/data/types';
import path from 'path';
import { SlashSubstitute } from '../consts';
import parseExifTime from '~/data/utils/parseExifTime';

const METRICS_START_TIME = Date.now();
const SCRIPT_PATH = import.meta.dirname;
const DIST_PATH = SCRIPT_PATH + '/dist';
const PUBLIC_DATA_PATH = path.join(SCRIPT_PATH, '../../public/__data');

// 加载本地 .env（OSS 凭证），便于直接运行 npm run build:data
try {
	process.loadEnvFile(path.join(SCRIPT_PATH, '../../.env'));
} catch {}

// 清理上一次构建产物，避免陈旧文件（如已不再生成的分区）被带入本次输出
await fs.rm(DIST_PATH, { recursive: true, force: true });
await mkdir(DIST_PATH);

// 指定在文件名中用于代替"/"的字符
const SLASH_SUBSTITUTE = SlashSubstitute;
// 获取oss客户端用于操作
const client = getOSSClient();
// 存储相册内容的根目录（前缀）
const PHOTO_ROOT = 'public/frame';
// 用于从文件路径中提取集合名称
const COLLECTION_ID_REGEX = /\/frame\/([0-9A-Za-z\-_\/]+)\//;

let continuationToken = '';
const result: OSS.ObjectMeta[] = [];

console.log('☁️ 枚举所有照片...');

// 遍历PHOTO_ROOT下的所有文件（含所有子目录内容）
while (true) {
	let res = await client.listV2(
		{
			prefix: PHOTO_ROOT,
			'continuation-token': continuationToken,
			'max-keys': 1000
		},
		{
			timeout: 5000
		}
	);

	result.push(...res.objects);

	if (res.isTruncated) {
		// @ts-ignore
		continuationToken = res.nextContinuationToken;
	} else {
		continuationToken = '';
		break;
	}
}

console.log(`☁️ 已列出 ${result.length} 个文件`);

console.log(`☁️ 构建照片文件目录...`);

await mkdir(DIST_PATH + '/filetrees');
const collectionFiletrees: Record<string, OSS.ObjectMeta[]> = {};

const exifCache = (await import(SCRIPT_PATH + '/exif_cache.json')).default as {
	name: string;
	exif?: Exif;
}[];
const exifCacheMap = new Map(exifCache.map(x => [x.name, x.exif]));

/**
 * 根据一个oss对象的name属性，拼接得到url属性的值
 * @param name objectmeta对象上的name属性
 * @returns 该name对应的url
 */
function ossNameToUrl(name: string) {
	return `https://fnmdp.oss-cn-beijing.aliyuncs.com/${name}`;
}

/**
 * 获取该路径对应文件的exif，优先从本地缓存中获取。
 * @param name 文件在oss上的完整路径
 * @returns 获取到的exif。如果没有获取到，返回undefined
 */
async function retrieveExifForName(name: string) {
	const cacheMatch = exifCacheMap.get(name);

	if (cacheMatch) return cacheMatch;

	console.log(`⌛️ 找不到 ${name} 的本地缓存，从远程获取`);

	const result = await fetch(`${ossNameToUrl(name)}?x-oss-process=image/info`);

	if (result.status === 200) {
		return (await result.json()) as Exif;
	}

	return undefined;
}

result
	.filter(x => isImageFilePath(x.name))
	.sort((a, b) => {
		let [dateA, dateB] = [getFileDateFromName(a.name), getFileDateFromName(b.name)];
		if (!dateA || !dateB) return 0;
		return Number(dateA) - Number(dateB);
	})
	.forEach(x => {
		const collectionIdExec = COLLECTION_ID_REGEX.exec(x.name);
		if (collectionIdExec !== null) {
			const collectionId = collectionIdExec[1];
			if (!collectionFiletrees[collectionId]) collectionFiletrees[collectionId] = [];
			collectionFiletrees[collectionId].push(x);
		}
	});

console.log(`📖 读取注解中...`);

// 读取captions文件夹下所有的文件名
const allCaptionFiles = await fs.readdir(SCRIPT_PATH + '/captions');
// 读取逆地理位置编码信息
const regeo: Record<string, RegeoItem> = (await import(SCRIPT_PATH + '/regeo.json')).default;

// 分集合记录每张照片上的注解信息，第一层键为集合名，如dawanqu/2023；第二层键为图片文件名，如1970.01.01_00:00:00.jpg
const collectionCaptionMap: Record<string, Record<string, CaptionItem>> = {};
let totalCaptions = 0;
const parseTomlCaptionTasks = allCaptionFiles
	.filter(filename => filename.endsWith('.toml'))
	.map(async fileName => {
		const tomlContent = await fs.readFile(SCRIPT_PATH + '/captions/' + fileName);
		const parsed = Toml.parse(tomlContent.toString(), '\n');
		collectionCaptionMap[
			// 'dawanqu_2019.toml' -> 'dawanqu/2019'
			fileName.replace(/([A-Za-z_0-9]+)\.toml/, '$1').replace('_', '/')
		] = parsed as Record<string, CaptionItem>;
		totalCaptions += Object.keys(parsed).length;
	});

// 解析所有toml格式的注解
await Promise.all(parseTomlCaptionTasks);

console.log(`✅ 读取到 ${parseTomlCaptionTasks.length} 个注解文件，共 ${totalCaptions} 个注解`);

const categoryCity: Category = {};
const categoryCityMetas: CategoryMeta<CityCategoryMeta> = {};
const categoryTime: Category = {};
const categoryTimeMetas: CategoryMeta = {};

function addToCategory(category: Category, key: string, name: string) {
	if (category[key] === undefined) category[key] = [];
	category[key].push(name);
}

function toNumber(value?: { value?: string }): number | undefined {
	if (!value || value.value === '') return undefined;
	const n = Number(value.value);
	return Number.isFinite(n) ? n : undefined;
}

/**
 * 解析形如 "13157/645" 的分数，返回数值；解析失败返回 undefined
 */
function parseFraction(value?: string): number | undefined {
	if (!value) return undefined;
	const [numStr, denStr] = value.split('/');
	const num = Number(numStr);
	if (!Number.isFinite(num)) return undefined;
	if (denStr === undefined) return num;
	const den = Number(denStr);
	if (!Number.isFinite(den) || den === 0) return undefined;
	return num / den;
}

/**
 * 把完整的 OSS 元数据 + EXIF 投影成页面真正需要的紧凑记录
 */
function toPhotoRecord(
	name: string,
	exif?: Exif,
	caption?: CaptionItem,
	addr?: string
): PhotoRecord {
	const record: PhotoRecord = { name };

	if (exif) {
		const date = exif.DateTime?.value;
		if (date) {
			record.date = date;
			record.ts = parseExifTime(date)?.getTime();
		}

		record.width = toNumber(exif.ImageWidth);
		record.height = toNumber(exif.ImageHeight);
		record.orientation = toNumber(exif.Orientation);
		record.model = exif.Model?.value;
		record.size = toNumber(exif.FileSize);

		if (exif.GPSLatitude?.value) record.lat = exif.GPSLatitude.value;
		if (exif.GPSLatitudeRef?.value === 'North' || exif.GPSLatitudeRef?.value === 'South') {
			record.latRef = exif.GPSLatitudeRef.value;
		}
		if (exif.GPSLongitude?.value) record.lng = exif.GPSLongitude.value;
		if (exif.GPSLongitudeRef?.value === 'East' || exif.GPSLongitudeRef?.value === 'West') {
			record.lngRef = exif.GPSLongitudeRef.value;
		}

		const altitude = parseFraction(exif.GPSAltitude?.value);
		if (altitude !== undefined) {
			record.altitude = exif.GPSAltitudeRef?.value === '1' ? -altitude : altitude;
		}
	}

	if (caption) record.caption = caption;
	if (addr) record.addr = addr;

	return record;
}

const writeFiletreeTasks = Object.keys(collectionFiletrees).map(async k => {
	const items = collectionFiletrees[k];
	const exifs = await Promise.all(items.map(item => retrieveExifForName(item.name)));
	const collectionCaptions = collectionCaptionMap[k];

	const records: PhotoRecord[] = items.map((item, index) => {
		const exif = exifs[index];

		if (exif?.DateTime?.value) {
			const time = parseExifTime(exif.DateTime.value);
			if (time) {
				const timeKey = `${time.getFullYear()} 年 ${time.getMonth() + 1} 月`;
				addToCategory(categoryTime, timeKey, item.name);
				categoryTimeMetas[timeKey] = {
					total: (categoryTimeMetas[timeKey]?.total ?? 0) + 1
				};
			}
		}

		// 'xxx/xxx/xxx/abc_efg.jpg' -> 'abc_efg.jpg'
		const filename = /.*\/((.*?)\.(\w+))$/.exec(item.name);
		const caption =
			filename !== null ? collectionCaptions?.[filename[1]] : undefined;

		let addr: string | undefined;
		const regeoItem = regeo[item.name];
		if (regeoItem) {
			addr =
				regeoItem.addressComponent.province +
				regeoItem.addressComponent.city +
				regeoItem.addressComponent.district +
				regeoItem.addressComponent.township;

			if (
				regeoItem.addressComponent.city.length > 0 ||
				regeoItem.addressComponent.province.length > 0
			) {
				const city =
					regeoItem.addressComponent.city.length > 0
						? regeoItem.addressComponent.city
						: regeoItem.addressComponent.province;
				addToCategory(categoryCity, city, item.name);
				if (!categoryCityMetas[city]) categoryCityMetas[city] = { total: 0 };
				categoryCityMetas[city].total++;
				if (categoryCityMetas[city].province === undefined) {
					categoryCityMetas[city].province =
						regeoItem.addressComponent.province.length > 0
							? regeoItem.addressComponent.province
							: city;
				}
			}
		}

		return toPhotoRecord(item.name, exif, caption, addr);
	});

	// 写入单独的文件
	await fs.writeFile(
		DIST_PATH + '/filetrees/' + k.replace('/', SLASH_SUBSTITUTE) + '.json',
		JSON.stringify(records)
	);

	console.log(`ℹ️ 集合 ${k} 中有 ${records.length} 张照片`);
});

await Promise.all(writeFiletreeTasks);

// 校验生成的记录没有重复名称
const allPhotoNames = Object.values(collectionFiletrees).flatMap(items => items.map(x => x.name));
if (new Set(allPhotoNames).size !== allPhotoNames.length) {
	throw new Error('构建失败：存在重复的照片名称');
}

await mkdir(DIST_PATH + '/categories');
await fs.writeFile(DIST_PATH + '/categories/city-meta.json', JSON.stringify(categoryCityMetas));
await fs.writeFile(DIST_PATH + '/categories/city.json', JSON.stringify(categoryCity));
await fs.writeFile(DIST_PATH + '/categories/time.json', JSON.stringify(categoryTime));
await fs.writeFile(DIST_PATH + '/categories/time-meta.json', JSON.stringify(categoryTimeMetas));

console.log(`☂️ 构建集合元信息...`);

const collections: CollectionMeta[] = (await import(SCRIPT_PATH + '/collections.json')).default;
const splittedCollections: Record<string, CollectionMeta> = {};

function traverseSplit(root: CollectionMeta, prefix: string = '', level: number = 0) {
	let name = prefix + (prefix ? '/' : '') + root.name;

	// 构造meta
	splittedCollections[name] = {
		...root,
		size: collectionFiletrees[name]?.length ?? 0,
		level: level++ // 记录 -> 自增
	};

	// 如果有children，则对每一个子meta进行处理
	if (root.children) {
		for (let child of root.children) {
			traverseSplit(child, name, level);
		}

		// 将子meta的size明细综合到当前的meta上
		splittedCollections[name].childSizes = Object.fromEntries(
			root.children.map(child => [
				child.name,
				splittedCollections[name + '/' + child.name]?.size ?? 0
			])
		);

		// 将childSizes归约为一个总和
		splittedCollections[name].size = Object.values(splittedCollections[name].childSizes).reduce(
			(ac, childSize) => ac + childSize,
			0
		);
	}
}

for (let collection of collections) {
	traverseSplit(collection);
}

await mkdir(DIST_PATH + '/collections');

const splitCollectionTasks = Object.keys(splittedCollections).map(async name => {
	await fs.writeFile(
		DIST_PATH + '/collections/' + name.replace('/', SLASH_SUBSTITUTE) + '.json',
		JSON.stringify(splittedCollections[name])
	);
});

await Promise.all(splitCollectionTasks);
await fs.writeFile(DIST_PATH + '/collections/__all.json', JSON.stringify(splittedCollections));

console.log(`☂️ 已写入 ${splitCollectionTasks.length} 个集合的元信息`);

// 整体刷新公开数据目录，保证里面不会残留本次构建未生成的文件
await fs.rm(PUBLIC_DATA_PATH, { recursive: true, force: true });
await fs.cp(DIST_PATH, PUBLIC_DATA_PATH, { recursive: true });

const METRICS_END_TIME = Date.now();

console.log(
	`✅ 已构建 ${writeFiletreeTasks.length} 个文件目录数据，花费时间 ${((METRICS_END_TIME - METRICS_START_TIME) / 1000).toFixed(2)}s`
);

console.log(`\n---\n`);

const sizeAnalytics: { filename: string; 'size (KiB)': number }[] = [];
await Promise.all(
	(await fs.readdir(DIST_PATH + '/filetrees')).map(async filename => {
		const stat = await fs.stat(`${DIST_PATH}/filetrees/${filename}`);
		sizeAnalytics.push({
			filename,
			'size (KiB)': Math.round((stat.size / 1024) * 100) / 100
		});
	})
);

console.table(sizeAnalytics);
