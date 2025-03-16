/**
 * @name compileStore
 * @description 用于从 filetrees、exifs、speicalSpots、manualGeo、geo 这些数据中整合出每一张图片所需信息，以图片为单位写入 store.json 形成网站的基本数据。
 */

// TODO: 该文件中逻辑可优化为按需而非重复写入的模式 2025.03.15
import fs from 'fs/promises';
import translateExifDate from './utils/exif/translateExifDate.mjs';
import translateExifCoords from './utils/exif/translateExifCoords.mjs';
import translateExifLensModel from './utils/exif/translateExifLensModel.mjs';
import toWGS84 from './utils/exif/toWGS84.mjs';
import spotIncludes from './utils/spotIncludes.mjs';
import { booleanPointInPolygon } from '@turf/turf';
import { exec } from 'child_process';

const filetreeContent = await fs.readFile('./filetrees.json');
const filetrees = JSON.parse(filetreeContent.toString());

const exifsContent = await fs.readFile('./exifs.json');
const exifs = JSON.parse(exifsContent.toString());

const mapCount = 5;
const geo = [];
for (let i = 1; i <= mapCount; i++) {
	const geoContent = await fs.readFile(`./map-${i}.json`);
	geo.push(...JSON.parse(geoContent.toString()));
}

const specialSpotsContent = await fs.readFile('./special-spots.json');
const specialSpots = JSON.parse(specialSpotsContent.toString());

const manualGeoContent = await fs.readFile('./manual-geo.json');
const manualGeo = JSON.parse(manualGeoContent.toString());

const captionsContent = await fs.readFile('./captions.json');
const captions = JSON.parse(captionsContent.toString());

const store = [];

const collections = filetrees.collections;
const collectionKeys = Object.keys(collections);

for (let collectionKey of collectionKeys) {
	if (collectionKey === 'about') continue;

	const files = collections[collectionKey].files;
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const object = {};

		object.name = file.name;
		object.url = file.url;
		object.size = file.size;
		object.collection = collectionKey;

		object.navigation = {
			prev: i - 1 < 0 ? null : files[i - 1].name,
			next: i + 1 > files.length - 1 ? null : files[i + 1].name
		};

		object.meta = {};

		const tgExifs = exifs.filter(x => x.name === object.name);
		if (tgExifs.length > 0) {
			const tgExif = tgExifs[0].exif;
			object.meta.date = translateExifDate(tgExif.DateTime)?.toJSON();

			const coords = translateExifCoords(tgExif.GPSLongitude, tgExif.GPSLatitude);
			object.meta.coordinates = coords;
			object.meta.wgs84 = coords.lat.length > 0 ? toWGS84(coords.lat, coords.lng) : [];
			object.meta.timeOffset = tgExif.OffsetTime?.value || '+08:00';
			object.meta.dimension = {
				h: tgExif.ImageHeight ? Number(tgExif.ImageHeight.value) : -1,
				w: tgExif.ImageWidth ? Number(tgExif.ImageWidth.value) : -1
			};
			object.meta.device = tgExif.Model?.value;
			object.meta.filesize = tgExif.FileSize ? Number(tgExif.FileSize.value) : -1;
			object.meta.lens = translateExifLensModel(tgExif.LensModel);
			object.meta.gpsspeed = tgExif.GPSSpeed ? eval(tgExif.GPSSpeed.value) : -1;
			object.meta.exposureTime = tgExif.ExposureTime?.value;
			object.meta.altitude = tgExif.GPSAltitude ? eval(tgExif.GPSAltitude.value) : -1;

			object.special = specialSpots.filter(x => spotIncludes(object.name, x, object.meta.date));
		}

		if (Object.keys(captions).includes(object.name)) {
			object.captions = Array.isArray(captions[object.name]) ? captions[object.name].join('') : captions[object.name];
		} else {
			object.captions = '';
		}

		if (object.meta.wgs84.length > 0) {
			const tgGeo = geo.filter(
				g =>
					booleanPointInPolygon([object.meta.wgs84[0], object.meta.wgs84[1]], {
						type: 'Polygon',
						coordinates: g.polygon
					}) && g.deep === 2
			);

			if (tgGeo.length > 0) {
				object.geo = {
					name: tgGeo[0].name,
					ext_path: tgGeo[0].ext_path,
					en_name: tgGeo[0]?.en_name,
					en_ext_path: tgGeo[0]?.en_ext_path
				};
			}
		}

		const tgManualGeo = manualGeo.filter(x => x.includes.some(y => object.name.endsWith(y)));

		if (tgManualGeo.length > 0) {
			object.geo = {
				name: tgManualGeo[0].name,
				ext_path: tgManualGeo[0].ext_path,
				en_name: tgManualGeo[0]?.en_name,
				en_ext_path: tgManualGeo[0]?.en_ext_path
			};
		}

		store.push(object);
	}
}

await fs.writeFile('./store.json', JSON.stringify(store));

exec('cp store.json ../server/assets');