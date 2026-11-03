import type { RegeoAoi, RegeoItem } from '~/data/types';

/**
 * 可以作为“景点”分组的 AOI 类型前缀（高德 POI 类型码）：
 * - 11xxxx：风景名胜（含公园广场、动物园、植物园、景区、地标、寺庙、海滩等）
 */
const SCENIC_TYPE_PREFIXES = ['11'];

/**
 * 博物馆/展览馆/美术馆/科技馆，作为点状景点单独成组。
 * 它们经常嵌在公园或景区内部，但用户通常会把“去博物馆”视作一次独立的到访。
 */
const MUSEUM_TYPE_PREFIXES = ['1401', '1402', '1404', '1406'];

/**
 * 拍照点到 AOI 的距离上限（米）。AOI 正常包含拍照点时 distance 为 0，
 * 留一点余量抵消定位误差和景区边界误差，但不接受只是“附近”的景点。
 * 该值不应大于 regeo.ts 中的 REGEO_RADIUS，否则可能拿不到需要的 AOI。
 */
const MAX_AOI_DISTANCE = 50;

/**
 * AOI 最小面积（平方米）。景区内部的观景台、码头、雕塑等局部 AOI 会把
 * 同一批照片拆得过细，面积过小的直接忽略，归到它所属的上级景点。
 */
const MIN_AOI_AREA = 5_000;

/**
 * 一个景点至少要有多少张照片才进入分类索引。低于该值的多半是路过时
 * 按下的快门，不足以构成一个可浏览的“景点”分组。
 */
export const MIN_SPOT_PHOTOS = 3;

export type SpotMatch = {
	/** 稳定键，优先使用高德 AOI id */
	key: string;
	name: string;
	type: string;
	adcode: string;
	/** 面积，平方米 */
	area: number;
};

type SpotCandidate = SpotMatch & { aoi: RegeoAoi };

function parseTypeCodes(type: string) {
	return type.split(/[|;]/).map(code => code.trim()).filter(Boolean);
}

function hasTypePrefix(type: string, prefixes: string[]) {
	return parseTypeCodes(type).some(code =>
		prefixes.some(prefix => code.startsWith(prefix))
	);
}

function isSpotAoiType(type: string) {
	return (
		hasTypePrefix(type, SCENIC_TYPE_PREFIXES) ||
		hasTypePrefix(type, MUSEUM_TYPE_PREFIXES)
	);
}

function toFiniteNumber(value: string): number | undefined {
	if (value === '') return undefined;
	const number = Number(value);
	return Number.isFinite(number) ? number : undefined;
}

/**
 * 判断 parent 是否在名称上涵盖了 child，例如：
 * “九寨沟” -> “九寨沟-扎如沟”，“深圳湾公园” -> “深圳湾公园观桥公园”。
 */
function isNameParent(parent: RegeoAoi, child: RegeoAoi) {
	const parentName = parent.name.trim();
	const childName = child.name.trim();

	return childName.startsWith(parentName) && childName.length > parentName.length;
}

function toCandidate(aoi: RegeoAoi): SpotCandidate | undefined {
	const area = toFiniteNumber(aoi.area);
	if (area === undefined || area < MIN_AOI_AREA) return undefined;

	const distance = aoi.distance === '' ? 0 : toFiniteNumber(aoi.distance);
	if (distance === undefined || distance > MAX_AOI_DISTANCE) return undefined;

	return {
		key: aoi.id || `${aoi.name}|${aoi.adcode}`,
		name: aoi.name,
		type: aoi.type,
		adcode: aoi.adcode,
		area,
		aoi
	};
}

function toSpotMatch(candidate: SpotCandidate): SpotMatch {
	const { key, name, type, adcode, area } = candidate;
	return { key, name, type, adcode, area };
}

function byAreaDesc(a: SpotCandidate, b: SpotCandidate) {
	return b.area - a.area;
}

/**
 * 从逆地理编码的 AOI 中找到拍照点所在的景点。
 *
 * 这里刻意不使用“附近 POI”或 `formatted_address` 里的地名：它们只能说明
 * 拍照点在景点附近，不能说明人在景点里面。AOI 的 distance 才能回答后一个问题，
 * 因此不在任何景区 AOI 内的照片不会得到景点分组。
 *
 * 同一坐标可能落在多个嵌套 AOI 里（大景区、子景区、观景台）。分组时按“目的地”
 * 而不是“最具体的面”来选，避免一次到访被拆成扎如沟、五花海、多肉园这样的子景点：
 * 1. 博物馆等点状展馆优先；
 * 2. 否则优先名称上涵盖其它候选的父级 AOI（九寨沟、深圳湾公园）；
 * 3. 再否则取面积最大的 AOI（整个景区/目的地）。
 */
export default function selectSpot(regeo?: RegeoItem): SpotMatch | undefined {
	if (!regeo?.aois?.length) return undefined;

	const candidates = regeo.aois
		.filter(aoi => aoi.name !== '' && isSpotAoiType(aoi.type))
		.map(toCandidate)
		.filter((spot): spot is SpotCandidate => spot !== undefined);

	if (candidates.length === 0) return undefined;

	const museums = candidates.filter(spot =>
		hasTypePrefix(spot.type, MUSEUM_TYPE_PREFIXES)
	);
	if (museums.length > 0) return toSpotMatch(museums.sort(byAreaDesc)[0]);

	const parents = candidates.filter(spot =>
		candidates.some(other => other !== spot && isNameParent(spot.aoi, other.aoi))
	);
	if (parents.length > 0) return toSpotMatch(parents.sort(byAreaDesc)[0]);

	return toSpotMatch(candidates.sort(byAreaDesc)[0]);
}
