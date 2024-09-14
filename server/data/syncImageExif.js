import filetrees from './filetrees.json' assert { type: 'json' };
import exifs from './exifs.json' assert { type: 'json' };
import axios from 'axios';
import fs from "fs/promises";

const allExifs = [];

function exifAlreadyPresent(name) {
    return exifs.filter(x => x.name === name).length > 0;
}

for (let k of Object.keys(filetrees.collections)) {
    const currentCollection = filetrees.collections[k];
    const currentExifs = [];

    for (let f of currentCollection.files) {
        if (exifAlreadyPresent(f.name)) {
            console.log(`the exif data of ${f.name} is already present, skipping...`);
            continue;
        }
        console.log('retrieving exif of ' + f.name)
        const result = await axios.get(f.url + "?x-oss-process=image/info")
        currentExifs.push({
            name: f.name,
            exif: result.data
        });
    }

    allExifs.push(...currentExifs);
}

await fs.writeFile('./exifs.json', JSON.stringify(allExifs));
