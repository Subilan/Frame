import { DataPath } from "~/consts";

// 静态数据在会话内不会变化，做一层内存缓存，避免路由切换时重复拉取
const cache = new Map<string, Promise<any>>();

/**
 * 批量获取json文件
 * @param paths 文件路径，以DataPath为起始
 * @returns json数组
 */
export async function getJson(paths: string[]) {
	const results = await Promise.allSettled(
		paths.map(path => {
			let promise = cache.get(path);
			if (!promise) {
				promise = fetch(DataPath + path).then(r => {
					if (!r.ok) throw new Error(`Failed to fetch ${path}: ${r.status}`);
					return r.json();
				});
				cache.set(path, promise);
				// 失败时不缓存，避免后续请求一直命中同一个错误
				promise.catch(() => cache.delete(path));
			}
			return promise;
		})
	);
	if (results.some(x => x.status === 'rejected')) return undefined;
	return results.filter(x => x.status === 'fulfilled').map(x => x.value);
}
