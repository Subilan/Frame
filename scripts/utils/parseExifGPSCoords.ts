const DMS_REGEX = /(\d+)\s*deg\s*(\d+)'\s*([\d.]+)"/;

/**
 * 解析 OSS 图片信息接口返回的度分秒坐标，如 `30deg 46' 17.700"`，得到十进制度数
 */
export default function parseExifGPSCoords(value: string) {
	const matched = DMS_REGEX.exec(value);
	if (matched === null) return undefined;

	const [, deg, min, sec] = matched;
	const parsed = Number(deg) + Number(min) / 60 + Number(sec) / 3600;

	return Number.isFinite(parsed) ? parsed : undefined;
}
