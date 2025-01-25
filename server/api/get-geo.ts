import { booleanPointInPolygon } from '@turf/turf';
import getGeoJson from '@/server/utils/getGeoJson';
import manualGeo from '@/static/data/manual-geo.json';
import getDayjs from '~/utils/getDayjs';
import translateExifDate from '~/utils/translateExifDate';

export default defineEventHandler(async e => {
	const geo = await getGeoJson();
	const query = getQuery(e);
	const depthStr = suspect(query.depth as string, '2');
	const coordinateX = suspect(query.x as string, '');
	const coordinateY = suspect(query.y as string, '');

	if (coordinateX === '' || coordinateY === '' || depthStr === '') return ng('invalid parameter');

	const x = Number(coordinateX);
	const y = Number(coordinateY);
	const depth = Number(depthStr);

	if (isNaN(x) || isNaN(y) || isNaN(depth)) return ng('invalid parameter');

	const tg = geo.filter(g => {
		return (
			booleanPointInPolygon([x, y], {
				type: 'Polygon',
				coordinates: g.polygon
			}) && g.deep === depth
		);
	});

	if (tg.length > 0) return tg[0];

	let name = suspect(query.name as string, '');
	name = atob(name);

	const res = manualGeo.filter(x => x.includes.some(y => name.endsWith(y)));

    if (res.length > 0) return res[0];

    return ng('nothing');
});
