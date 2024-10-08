import axios from 'axios';
import fs from "fs/promises";
import {exists} from "./utils/exists.js";

let [dataFiletrees, dataExifs] = [undefined, undefined];

function exifAlreadyPresent(name) {
    if (!dataExifs) return false;
    return dataExifs.filter(x => x.name === name).length > 0;
}

if (await exists('./filetrees.json')) {
    const filetreeContent = await  fs.readFile('./filetrees.json');
    dataFiletrees = JSON.parse(filetreeContent.toString());
}

if (await exists('./exifs.json')) {
    const exifsContent = await fs.readFile('./exifs.json');
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
        console.log('retrieving exif of ' + f.name)
        const result = await axios.get(f.url + "?x-oss-process=image/info")
        currentExifs.push({
            name: f.name,
            exif: result.data
        });
    }

    allExifs.push(...currentExifs);
}

if (Array.isArray(dataExifs)) {
    allExifs.push(...dataExifs);
}

await fs.writeFile('./exifs.json', JSON.stringify(allExifs));
