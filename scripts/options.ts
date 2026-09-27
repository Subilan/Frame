function readArg(name: string) {
	const prefix = `--${name}`;
	const hit = process.argv.slice(2).find(x => x === prefix || x.startsWith(prefix + '='));
	if (hit === undefined) return undefined;
	return hit.slice(prefix.length + 1);
}

export const options = {
	/** 全量重新请求逆地理编码，而不是只补缺失项 */
	forceRegeo: readArg('force') !== undefined,
	/** 跳过逆地理编码，用于没有 AMAP_KEY 时也能产出其余数据 */
	skipRegeo: readArg('skip-regeo') !== undefined,
	/** 逆地理编码的请求间隔，避免超过高德的 QPS 限制 */
	regeoIntervalMs: Number(readArg('interval') ?? 350)
};
