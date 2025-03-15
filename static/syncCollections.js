/**
 * Sync Collections
 *
 * 从 OSS 获取到当前存在的所有合集数据，并将其中包含的文件信息保存到本地
 */

import getOSSClient from "./utils/getOSSClient.mjs";
import isImageFilePath from "./utils/isImageFilePath.mjs";
import getFileDateFromName from "./utils/getFileDateFromName.mjs";
import fs from 'fs/promises'

const client = getOSSClient();

let continuationToken = '';
let result = [];

while (true) {
    let res = await client.listV2({
        prefix: 'public/frame',
        "continuation-token": continuationToken,
        "max-keys": 1000
    }, {
        timeout: 5000
    })

    result.push(...res.objects);

    if (res.isTruncated) {
        continuationToken = res.nextContinuationToken;
    } else {
        continuationToken = '';
        break;
    }
}

const fileTree = result.filter(x => isImageFilePath(x.name)).sort((a, b) => getFileDateFromName(b.name)?.getTime() - getFileDateFromName(a.name)?.getTime());
const collections = {};

fileTree.forEach(x => {
    x.url = x.url.replace('http', 'https');
    const collectionIdExec = /\/frame\/([0-9A-Za-z\-_]+)\//.exec(x.url);
    if (collectionIdExec !== null) {
        const collectionId = collectionIdExec[1];
        if (!Object.keys(collections).includes(collectionId)) collections[collectionId] = {
            files: [],
            totalSize: -1
        }
        collections[collectionId]['files'].push(x);
        collections[collectionId]['totalSize'] += x.size;
    }
})

const text = JSON.stringify({
    collections,
    totalSize: fileTree.reduce((a, b) => a + b.size, 0)
});

await fs.writeFile('./filetrees.json', text);