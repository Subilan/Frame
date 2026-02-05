import fs from 'fs/promises'

const exifFilepath = `${import.meta.dirname}/exifs.json`;

const exifs = JSON.parse((await fs.readFile(exifFilepath)).toString());

const result = {};

for (const exif of exifs) {
    result[exif.name] = exif;
}

await fs.writeFile(`${import.meta.dirname}/exifs_indexed.json`, JSON.stringify(result));