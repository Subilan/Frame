import { exists } from "./utils/exists.mjs";
import fs from 'fs/promises';

const FILETREES_PATH = import.meta.dirname + '/filetrees.json';
const EXIFS_PATH = import.meta.dirname + '/exifs.json';

if (!await exists(FILETREES_PATH) || !await exists(EXIFS_PATH)) {
    throw 'missing required files';
}

const filetrees = JSON.parse((await fs.readFile(FILETREES_PATH)).toString());
const exifs = JSON.parse((await fs.readFile(EXIFS_PATH)).toString());

// for (const collection of filetrees) {
//     console.log(collection)
// }

for (const collectionName of Object.keys(filetrees.collections)) {
    const collection = filetrees.collections[collectionName];

    for (const f  of collection.files) {
        const exifItem = exifs.find(x => x.name === f.name);

        if (exifItem && exifItem.exif && exifItem.exif.ImageWidth && exifItem.exif.ImageHeight) {
            f.width = Number(exifItem.exif.ImageWidth.value);
            f.height = Number(exifItem.exif.ImageHeight.value);

            if (exifItem.exif.Orientation.value === '6') {
                let t = f.width;
                f.width = f.height;
                f.height = t;
            }
        }
    }
}

await fs.writeFile(import.meta.dirname + '/filetrees_merged.json', JSON.stringify(filetrees))