import * as Toml from '@ltd/j-toml';
import fs from 'fs/promises';

const files = await fs.readdir(import.meta.dirname + '/captions');

const result = {};

for (const filename of files) {
    const filePath = `${import.meta.dirname}/captions/${filename}`;

    const tomlFile = await fs.readFile(filePath);
    const parsed = Toml.parse(tomlFile.toString(), '\n');
    result[filename.replace('.toml', '').replace('_', '/')] = parsed;
}

await fs.writeFile(import.meta.dirname + '/captions.json', JSON.stringify(result));
