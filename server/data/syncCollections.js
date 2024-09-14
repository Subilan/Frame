import getOSSClient from "./utils/getOSSClient.js";
import isImageFilePath from "./utils/isImageFilePath.js";
import getFileDateFromName from "./utils/getFileDateFromName.js";
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

const text = JSON.stringify(result.filter(x => isImageFilePath(x.name)).sort((a, b) => getFileDateFromName(b.name)?.getTime() - getFileDateFromName(a.name)?.getTime()));
await fs.writeFile('./collections.json', text);