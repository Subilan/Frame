import fs from 'fs/promises';
import path from 'path';
import exists from './utils/exists';
import normalizeRegeo from './utils/normalizeRegeo';
import parseExifGPSCoords from './utils/parseExifGPSCoords';
import type { PhotoRecord, RegeoItem } from '~/data/types';

const SCRIPT_PATH = import.meta.dirname;
const FILETREE_PATH = SCRIPT_PATH + '/dist/filetrees';
const REGEO_PATH = SCRIPT_PATH + '/regeo.json';
const AMAP_ENDPOINT = 'https://restapi.amap.com/v3/geocode/regeo';

// 这些错误重试没有意义，直接中止，避免浪费配额
const FATAL_INFOCODES = new Set(['10001', '10003', '10009', '10012', '10013', '10019']);

function readArg(name: string) {
	const prefix = `--${name}`;
	const hit = process.argv.slice(2).find(x => x === prefix || x.startsWith(prefix + '='));
	if (hit === undefined) return undefined;
	return hit.slice(prefix.length + 1);
}

function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

try {
	process.loadEnvFile(path.join(SCRIPT_PATH, '../../.env'));
} catch {}

const apiKey = process.env.AMAP_KEY;

if (!apiKey) {
	throw new Error('缺少 AMAP_KEY，请在高德开放平台申请 Web 服务 key 并写入 .env');
}

if (!(await exists(FILETREE_PATH))) {
	throw new Error('缺少 dist/filetrees，请先运行 photos 阶段：npm run build:all -- --stage=photos');
}

const force = readArg('force') !== undefined;
const interval = Number(readArg('interval') ?? 350);

const filetrees = await fs.readdir(FILETREE_PATH);
const photos = new Map<string, PhotoRecord>();

for (const filename of filetrees) {
	const items: PhotoRecord[] = JSON.parse(
		await fs.readFile(FILETREE_PATH + '/' + filename, 'utf8')
	);

	for (const item of items) photos.set(item.name, item);
}

const existing: Record<string, RegeoItem> = await fs
	.readFile(REGEO_PATH, 'utf8')
	.then(content => JSON.parse(content))
	.catch(() => ({}));

type RegeoTarget = { name: string; lng: number; lat: number };

const targets: RegeoTarget[] = [];

for (const photo of photos.values()) {
	const lng = photo.lng ? parseExifGPSCoords(photo.lng) : undefined;
	const lat = photo.lat ? parseExifGPSCoords(photo.lat) : undefined;

	if (lng === undefined || lat === undefined) continue;

	targets.push({
		name: photo.name,
		lng: photo.lngRef === 'West' ? -lng : lng,
		lat: photo.latRef === 'South' ? -lat : lat
	});
}

const pending = force ? targets : targets.filter(x => existing[x.name] === undefined);

console.log(
	`🌏 共 ${targets.length} 张照片带 GPS，本地已有 ${targets.length - pending.length} 条，本次请求 ${pending.length} 条`
);

async function queryRegeo(target: RegeoTarget) {
	const location = `${target.lng.toFixed(6)},${target.lat.toFixed(6)}`;
	const url = `${AMAP_ENDPOINT}?key=${apiKey}&location=${location}&extensions=base&coordsys=gps`;

	const response = await fetch(url);

	if (!response.ok) throw new Error(`HTTP ${response.status}`);

	const body = (await response.json()) as {
		status: string;
		info: string;
		infocode: string;
		regeocode?: RegeoItem;
	};

	if (body.status !== '1' || !body.regeocode) {
		const error = new Error(`${body.info}（${body.infocode}）`);
		Object.assign(error, { infocode: body.infocode });
		throw error;
	}

	return body.regeocode;
}

const fetched = new Map<string, RegeoItem>();
const failures: string[] = [];
let fatal: string | undefined;

for (const [index, target] of pending.entries()) {
	if (fatal !== undefined) break;

	for (let attempt = 1; ; attempt++) {
		try {
			fetched.set(target.name, await queryRegeo(target));
			break;
		} catch (e) {
			const message = e instanceof Error ? e.message : String(e);
			const infocode = (e as { infocode?: string }).infocode;

			if (infocode !== undefined && FATAL_INFOCODES.has(infocode)) {
				fatal = `${target.name}：${message}`;
				break;
			}

			if (attempt >= 3) {
				failures.push(`${target.name}：${message}`);
				break;
			}

			await sleep(1000 * attempt);
		}
	}

	const done = index + 1;
	if (done % 20 === 0 || done === pending.length) {
		console.log(`⌛️ 已请求 ${done}/${pending.length}`);
	}

	if (done < pending.length) await sleep(interval);
}

if (fatal !== undefined) {
	throw new Error(`高德接口返回致命错误，已中止，未写入文件：${fatal}`);
}

const merged: Record<string, RegeoItem> = {};

if (!force) {
	for (const [name, item] of Object.entries(existing)) {
		if (photos.has(name)) merged[name] = item;
	}
}

for (const name of [...fetched.keys()].sort((a, b) => a.localeCompare(b))) {
	merged[name] = fetched.get(name)!;
}

const normalized = Object.fromEntries(
	Object.entries(merged).map(([name, item]) => [name, normalizeRegeo(item)])
);

await fs.writeFile(REGEO_PATH, JSON.stringify(normalized, null, 4));

const stale = Object.keys(existing).filter(name => !photos.has(name)).length;

console.log(
	`💾 已写入 ${Object.keys(normalized).length} 条逆地理编码，本次获取 ${fetched.size} 条，清理已失效条目 ${stale} 条`
);

if (failures.length > 0) {
	console.warn(`⚠️ ${failures.length} 条请求失败，可重新运行以增量补齐：\n${failures.join('\n')}`);
}

process.exitCode = failures.length > 0 ? 1 : 0;
