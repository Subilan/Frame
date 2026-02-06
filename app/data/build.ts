import getFileDateFromName from './utils/getFileDateFromName';
import getOSSClient from './utils/getOSSClient';
import isImageFilePath from './utils/isImageFilePath';
import fs from 'fs/promises';
import mkdir from './utils/mkdir';
import type { Exif } from './exifs';
import * as Toml from '@ltd/j-toml';
import type {
	CaptionItem,
	CollectionItem,
	CollectionMeta,
	RegeoItem
} from '~/data/types';
import path from 'path';
import { SlashSubstitute } from '../consts';

const METRICS_START_TIME = Date.now();
const SCRIPT_PATH = import.meta.dirname;
const DIST_PATH = SCRIPT_PATH + '/dist';
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
let result = [];

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

mkdir(DIST_PATH + '/filetrees');
const collectionFiletrees: Record<string, CollectionItem[]> = {};

const exifCache = (await import(SCRIPT_PATH + '/exif_cache.json')).default as {
	name: string;
	exif?: Exif;
}[];

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
	const cacheMatch = exifCache.find(x => x.name === name)?.exif;

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
		x.url = x.url.replace('http', 'https');
		const collectionIdExec = COLLECTION_ID_REGEX.exec(x.url);
		if (collectionIdExec !== null) {
			const collectionId = collectionIdExec[1];
			if (!collectionFiletrees[collectionId]) collectionFiletrees[collectionId] = [x];
			else collectionFiletrees[collectionId].push(x);
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

// const searchIndex: Record<string, Pick<CollectionItem, 'name' | 'url'>> = {};

const writeFiletreeTasks = Object.keys(collectionFiletrees).map(async k => {
	// 获取exif字段
	await Promise.all(
		collectionFiletrees[k].map(async item => {
			item.exif = await retrieveExifForName(item.name);

			// if (item.exif) {
			// 	const time = parseExifTime(item.exif.DateTime.value);
			// 	if (time) {
			// 		const [y, m, d] = [time.getFullYear(), time.getMonth() + 1, time.getDate()];
			// 		const keywords = [
			// 			`${y}年`,
			// 			`${m}月`,
			// 			`${y}年${m}月`,
			// 			`${y}-${m}`,
			// 			`${y}.${m}`,
			// 			`${y}-${m}-${d}`,
			// 			`${y}.${m}.${d}`
			// 		];
			// 		const zm = m < 10 ? `0${m}` : undefined;
			// 		if (zm) {
			// 			keywords.push(
			// 				...[
			// 					`${y}年${zm}月`,
			// 					`${y}-${zm}`,
			// 					`${y}.${zm}`,
			// 					`${y}-${zm}-${d}`,
			// 					`${y}.${zm}.${d}`
			// 				]
			// 			);
			// 		}

			// 		for (let keyword of keywords) {
			// 			searchIndex[keyword] = {
			// 				name: item.name,
			// 				url: item.url
			// 			};
			// 		}
			// 	}
			// }
		})
	);

	// 获取caption字段
	const collectionCaptions = collectionCaptionMap[k];

	collectionFiletrees[k].forEach(item => {
		// 'xxx/xxx/xxx/abc_efg.jpg' -> 'abc_efg.jpg'
		const filename = /.*\/((.*?)\.(\w+))$/.exec(item.name);
		if (filename !== null && collectionCaptions) {
			item.caption = collectionCaptions[filename[1]];
		}
	});

	// 获取addr字段
	collectionFiletrees[k].forEach(item => {
		const regeoItem = regeo[item.name];
	});

	// 写入单独的文件
	await fs.writeFile(
		DIST_PATH + '/filetrees/' + k.replace('/', SLASH_SUBSTITUTE) + '.json',
		JSON.stringify(collectionFiletrees[k])
	);

	console.log(`ℹ️ 集合 ${k} 中有 ${collectionFiletrees[k].length} 张照片`);
});

await Promise.all(writeFiletreeTasks);

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

await fs.cp(DIST_PATH, path.join(SCRIPT_PATH, '../../public/__data'), { recursive: true });

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
