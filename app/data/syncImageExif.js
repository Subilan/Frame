/**
 * Sync Image Exifs
 *
 * 通过 OSS 的 x-oss-process 查询相关图片的 exif 数据，并保存在本地
 * 对于已经获取到的图片 exif 数据，不会重复获取
 */

import fs from 'fs/promises';
import { exists } from './utils/exists.mjs';

let [dataFiletrees, dataExifs] = [undefined, undefined];

function exifAlreadyPresent(name) {
	if (!dataExifs) return false;
	return dataExifs.filter(x => x.name === name).length > 0;
}

const FILETREES_PATH = import.meta.dirname + '/filetrees.json';
const EXIFS_PATH = import.meta.dirname + '/exifs.json';

if (await exists(FILETREES_PATH)) {
	const filetreeContent = await fs.readFile(FILETREES_PATH);
	dataFiletrees = JSON.parse(filetreeContent.toString());
}

if (await exists(EXIFS_PATH)) {
	const exifsContent = await fs.readFile(EXIFS_PATH);
	dataExifs = JSON.parse(exifsContent.toString());
}

const allExifs = [];

for (let k of Object.keys(dataFiletrees.collections)) {
	const currentCollection = dataFiletrees.collections[k];
	const currentExifs = [];

	for (let f of currentCollection.files) {
		if (exifAlreadyPresent(f.name)) {
			console.log(`the exif data of ${f.name} is already present, skipping...`);
			continue;
		}
		console.log('retrieving exif of ' + f.name);
		const result = await fetch(f.url + '?x-oss-process=image/info');
		if (result.status === 200) {
            const result_json = await result.json();
			currentExifs.push({
				name: f.name,
				exif: result_json
			});
		}
	}

	allExifs.push(...currentExifs);
}

if (Array.isArray(dataExifs)) {
	allExifs.push(...dataExifs);
}

await fs.writeFile(EXIFS_PATH, JSON.stringify(allExifs));
