import fs from 'fs/promises';

const ROOT = import.meta.dirname;

// 所有照片信息
const filetree = JSON.parse(await fs.readFile(ROOT + '/filetrees_merged.json'));
const exifs = JSON.parse(await fs.readFile(ROOT + '/exifs_indexed.json'));
const regeo = JSON.parse(await fs.readFile(ROOT + '/regeo.json'));
const captions = JSON.parse(await fs.readFile(ROOT + '/captions.json'));

const exifDatetimeRegex = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

const files = Object.entries(filetree.collections)
	.map(([k, v]) =>
		v.files.map(vv => ({
			...vv,
			collection: k
		}))
	)
	.flat()
	.map(x => ({
		...x,
		regeo: regeo[x.name],
		caption: captions[x.name],
		exif: exifs[x.name].exif
	}))
	.map(x => ({
		// name: x.name,
		url: x.url,
		// size: x.size,
		// width: x.width,
		// height: x.height,
		datetime: (() => {
			if (!x.exif.DateTime || !x.exif.DateTime.value) return [];
			const result = exifDatetimeRegex.exec(x.exif.DateTime.value);
			if (result === null) {
				console.warn(`${x.exif.DateTime.value} does not satisfy datetime regex`);
				return [];
			}

			return result.slice(1).map(x => +x);
		})(),
		collection: x.collection,
		addr: x.regeo?.formatted_address,
		captionText: x.caption && x.caption.title + x.caption.content
	}))
	.map(x => ({
		url: x.url,
		keywords: [x.addr, x.collection].concat(x.captionText ? [x.captionText] : []).concat(
			(() => {
				if (x.datetime.length !== 6) return [];

				const d = x.datetime;

				return [
					`${d[0]}年`,
					d[0].toString(),
					`${d[1]}月`,
					`${d[2]}日`,
					`${d[3]}时`,
					`${d[4]}分`,
					`${d[5]}秒`,
					`${d[0]}-${d[1]}`,
					`${d[0]}.${d[1]}`,
					`${d[0]}-${d[1]}-${d[2]}`,
					`${d[0]}.${d[1]}.${d[2]}`
				];
			})()
		)
	}));

console.log(files);

await fs.writeFile(ROOT + '/sequential_search.json', JSON.stringify(files));
