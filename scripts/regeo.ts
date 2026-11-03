import fs from 'fs/promises';
import normalizeRegeo from './utils/normalizeRegeo';
import { CACHE_PATH, ENV_PATH } from './paths';
import type { RegeoItem } from '~/data/types';

const REGEO_PATH = CACHE_PATH + '/regeo.json';
const AMAP_ENDPOINT = 'https://restapi.amap.com/v3/geocode/regeo';
/** extensions=all 会额外返回 AOI，照片落在其中时 distance=0，用于识别所在景点 */
const REGEO_EXTENSIONS = 'all';
/** AOI 检索半径（米）；只关心包含拍照点的 AOI（distance≈0），200m 足够覆盖边界误差 */
const REGEO_RADIUS = 200;
/** 请求间隔，避免超过高德的 QPS 限制 */
const REGEO_INTERVAL_MS = 350;
/** 并发数；间隔仍限制整体 QPS，并发只用来抵消单次请求的延迟 */
const REGEO_CONCURRENCY = 8;

// 这些错误重试没有意义，直接中止，避免浪费配额
const FATAL_INFOCODES = new Set(['10001', '10003', '10009', '10012', '10013', '10019']);

export type RegeoTarget = {
	name: string;
	lng: number;
	lat: number;
};

/** regeo 缓存文件的结构，updatedAt 记录最近一次从高德获取数据的日期 */
type RegeoCacheFile = {
	updatedAt?: string;
	items: Record<string, RegeoItem>;
};

type AmapResponse = {
	status: string;
	info: string;
	infocode: string;
	regeocode?: RegeoItem;
};

function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function toDateString(date: Date) {
	const pad = (value: number) => String(value).padStart(2, '0');

	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseCache(raw: string): RegeoCacheFile {
	try {
		const parsed = JSON.parse(raw);
		if (parsed === null || typeof parsed !== 'object') return { items: {} };

		// 兼容早期只有名称映射、没有 updatedAt 的格式
		if ('items' in parsed) return { updatedAt: parsed.updatedAt, items: parsed.items };

		return { items: parsed };
	} catch {
		return { items: {} };
	}
}

function readApiKey() {
	try {
		process.loadEnvFile(ENV_PATH);
	} catch {}

	const apiKey = process.env.AMAP_KEY;

	if (!apiKey) {
		throw new Error(
			'缺少 AMAP_KEY，请在高德开放平台申请 Web 服务 key 并写入 .env'
		);
	}

	return apiKey;
}

async function queryRegeo(apiKey: string, target: RegeoTarget) {
	const location = `${target.lng.toFixed(6)},${target.lat.toFixed(6)}`;
	const url =
		`${AMAP_ENDPOINT}?key=${apiKey}&location=${location}` +
		`&extensions=${REGEO_EXTENSIONS}&radius=${REGEO_RADIUS}&coordsys=gps`;

	const response = await fetch(url);

	if (!response.ok) throw new Error(`HTTP ${response.status}`);

	const body = (await response.json()) as AmapResponse;

	if (body.status !== '1' || !body.regeocode) {
		const error = new Error(`${body.info}（${body.infocode}）`);
		Object.assign(error, { infocode: body.infocode });
		throw error;
	}

	return body.regeocode;
}

async function fetchAll(apiKey: string, pending: RegeoTarget[]) {
	const fetched = new Map<string, RegeoItem>();
	const failures: string[] = [];
	let fatal: string | undefined;

	let nextIndex = 0;
	let nextStartAt = 0;
	let done = 0;

	/**
	 * 只控制请求的发起时间，不等待响应。所有 worker 共享 nextStartAt，
	 * 因此无论并发数多大，整体 QPS 仍然受 interval 限制；并发只是用来抵消
	 * extensions=all 单次请求较长的响应时间。
	 */
	async function waitForRequestSlot() {
		const now = Date.now();
		const startAt = Math.max(now, nextStartAt);
		nextStartAt = startAt + REGEO_INTERVAL_MS;

		if (startAt > now) await sleep(startAt - now);
	}

	async function worker() {
		while (fatal === undefined) {
			const index = nextIndex++;
			if (index >= pending.length) return;

			const target = pending[index];

			for (let attempt = 1; ; attempt++) {
				await waitForRequestSlot();

				try {
					fetched.set(target.name, await queryRegeo(apiKey, target));
					break;
				} catch (e) {
					const message = e instanceof Error ? e.message : String(e);
					const infocode = (e as { infocode?: string }).infocode;

					if (infocode !== undefined && FATAL_INFOCODES.has(infocode)) {
						fatal = `${target.name}：${message}`;
						return;
					}

					if (attempt >= 3) {
						failures.push(`${target.name}：${message}`);
						break;
					}

					await sleep(1000 * attempt);
				}
			}

			done++;
			if (done % 20 === 0 || done === pending.length) {
				console.log(`⌛️ 已请求 ${done}/${pending.length}`);
			}
		}
	}

	const concurrency = Math.max(1, Math.floor(REGEO_CONCURRENCY) || 1);
	await Promise.all(
		Array.from({ length: Math.min(concurrency, pending.length) }, worker)
	);

	return { fetched, failures, fatal };
}

/**
 * 补齐缺失的逆地理编码并返回完整结果，供本次构建直接使用
 * @param targets 本次构建中所有带 GPS 的照片及其坐标
 */
export default async function buildRegeo(
	targets: RegeoTarget[]
): Promise<RegeoCacheFile> {
	const rawCache = await fs.readFile(REGEO_PATH, 'utf8').catch(() => '');
	const cache = parseCache(rawCache);

	const targetNames = new Set(targets.map(x => x.name));
	const pending = targets.filter(x => {
		const cached = cache.items[x.name];
		// 旧缓存由 extensions=base 生成，没有 aois，需要补取一次才能识别所在景点
		return cached === undefined || cached.aois === undefined;
	});

	let fetched = new Map<string, RegeoItem>();

	if (pending.length === 0) {
		console.log(`🌏 逆地理编码缓存已覆盖全部 ${targets.length} 张带 GPS 的照片`);
	} else {
		console.log(`🌏 需要请求 ${pending.length} 条逆地理编码`);

		const result = await fetchAll(readApiKey(), pending);

		if (result.fatal !== undefined) {
			throw new Error(`高德接口返回致命错误，已中止，未写入缓存：${result.fatal}`);
		}

		fetched = result.fetched;

		if (result.failures.length > 0) {
			console.warn(
				`⚠️ ${result.failures.length} 条逆地理编码请求失败，下次构建会重试：\n${result.failures.join('\n')}`
			);
			process.exitCode = 1;
		}
	}

	// 保留顺序：已有条目维持原位，新条目按名称排序追加
	const merged: Record<string, RegeoItem> = {};

	for (const [name, item] of Object.entries(cache.items)) {
		if (targetNames.has(name) && !fetched.has(name)) merged[name] = item;
	}

	for (const name of [...fetched.keys()].sort((a, b) => a.localeCompare(b))) {
		merged[name] = fetched.get(name)!;
	}

	const normalized: Record<string, RegeoItem> = Object.fromEntries(
		Object.entries(merged).map(([name, item]) => [name, normalizeRegeo(item)])
	);

	// 没有新抓取到的数据时，沿用缓存里记录的时间
	const updatedAt =
		fetched.size > 0 ? toDateString(new Date()) : cache.updatedAt;

	const serialized = JSON.stringify({ updatedAt, items: normalized }, null, 4);

	if (serialized !== rawCache) {
		await fs.writeFile(REGEO_PATH, serialized);

		const stale = Object.keys(cache.items).filter(name => !targetNames.has(name)).length;

		console.log(
			`💾 已写入 ${Object.keys(normalized).length} 条逆地理编码，本次获取 ${fetched.size} 条，清理已失效条目 ${stale} 条`
		);
	}

	return { updatedAt, items: normalized };
}
