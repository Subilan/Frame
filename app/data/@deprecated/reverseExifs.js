import { existsSync } from 'fs';
import fs from 'fs/promises';

const EXIFS_PATH = import.meta.dirname + '/exifs.json';
const OUTPUT_PATH = import.meta.dirname + '/regeo.json';

const exifs = JSON.parse((await fs.readFile(EXIFS_PATH)).toString());

if (!existsSync(OUTPUT_PATH)) {
	await fs.writeFile(OUTPUT_PATH, '{}');
}

const regeo = JSON.parse((await fs.readFile(OUTPUT_PATH)).toString());

const exifDegPattern = /(\d+)deg (\d+)' (\d+)\.(\d+)"/;

function getRealValue(execResult) {
	return Number(execResult[1]) + Number(execResult[2]) / 60 + (Number(execResult[3]) + 0.001 * Number(execResult[4])) / 3600;
}

for (const exif of exifs) {
	if (regeo[exif.name] !== undefined) {
		console.log(`regeo for ${exif.name} already exists. skipping.`);
		continue;
	}
	const content = exif.exif;
	if (content.GPSLatitude && content.GPSLongitude) {
		const latitudeExec = exifDegPattern.exec(content.GPSLatitude.value);
		const longitudeExec = exifDegPattern.exec(content.GPSLongitude.value);
		if (latitudeExec !== null && longitudeExec !== null) {
			const lat = getRealValue(latitudeExec);
			const lon = getRealValue(longitudeExec);

			const result = await fetch(`https://restapi.amap.com/v3/geocode/regeo?key=16572b97b05df61393972145a8bc728c&location=${lon.toFixed(6)},${lat.toFixed(6)}`);
			const r = await result.json();
			if (r.status === '1') {
                console.log('retrieved for ' + exif.name)
				regeo[exif.name] = r.regeocode;
			}
		}
	}
}

await fs.writeFile(OUTPUT_PATH, JSON.stringify(regeo));
