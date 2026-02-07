import { DataPath } from "~/consts";

/**
 * 批量获取json文件
 * @param paths 文件路径，以DataPath为起始
 * @returns json数组
 */
export async function getJson(paths: string[]) {
	const results = await Promise.allSettled(
		paths.map(path => fetch(DataPath + path).then(r => r.json()))
	);
	if (results.some(x => x.status === 'rejected')) return undefined;
	return results.filter(x => x.status === 'fulfilled').map(x => x.value);
}
