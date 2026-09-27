import type { RegeoBusinessArea, RegeoItem } from '~/data/types';

function asRecord(value: unknown): Record<string, unknown> {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) return {};
	return value as Record<string, unknown>;
}

/**
 * 高德的字段无值时返回空数组而不是空字符串，统一收敛成字符串
 */
function toText(value: unknown): string {
	if (typeof value === 'string') return value;
	if (Array.isArray(value)) {
		const first = value.find(x => typeof x === 'string');
		return typeof first === 'string' ? first : '';
	}
	return '';
}

/**
 * 把接口原始返回规整成 RegeoItem，字段顺序与已有的 regeo.json 保持一致
 */
export default function normalizeRegeo(input: unknown): RegeoItem {
	const raw = asRecord(input);
	const source = asRecord(raw.addressComponent);
	const streetNumber = asRecord(source.streetNumber);
	const building = asRecord(source.building);
	const neighborhood = asRecord(source.neighborhood);

	const businessAreas: RegeoBusinessArea[] = (
		Array.isArray(source.businessAreas) ? source.businessAreas : []
	)
		.filter(
			(x): x is Record<string, unknown> =>
				x !== null && typeof x === 'object' && !Array.isArray(x)
		)
		.map(x => ({
			location: toText(x.location),
			name: toText(x.name),
			id: toText(x.id)
		}));

	return {
		addressComponent: {
			city: toText(source.city),
			province: toText(source.province),
			adcode: toText(source.adcode),
			district: toText(source.district),
			towncode: toText(source.towncode),
			streetNumber: {
				number: toText(streetNumber.number),
				location: toText(streetNumber.location),
				direction: toText(streetNumber.direction),
				distance: toText(streetNumber.distance),
				street: toText(streetNumber.street)
			},
			country: toText(source.country),
			township: toText(source.township),
			seaArea: source.seaArea === undefined ? undefined : toText(source.seaArea),
			businessAreas,
			building: {
				name: toText(building.name),
				type: toText(building.type)
			},
			neighborhood: {
				name: toText(neighborhood.name),
				type: toText(neighborhood.type)
			},
			citycode: toText(source.citycode)
		},
		formatted_address: toText(raw.formatted_address)
	};
}
