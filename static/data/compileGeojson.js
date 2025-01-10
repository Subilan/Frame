/**
 * Compile GeoJson
 *
 * 对获取到的 geojson 数据进行预处理，转换为程序可以识别的形式。
 *
 * GeoJson 来源：https://github.com/xiangyuecn/AreaCity-JsSpider-StatsGov
 */

import {exists} from "./utils/exists.js";
import fs from "fs/promises";

if (!(await exists( './map.geojson'))) {
    console.log('could not find target file map.geojson in current directory');
    process.exit();
}

const geoContent = await fs.readFile('./map.geojson');
const geoContentParsed = JSON.parse(geoContent.toString());

const features = geoContentParsed.features;

const result = [];

features.forEach(x => {
    result.push(x.properties);
})

for (let r of result) {
    // 处理依据：https://github.com/xiangyuecn/AreaCity-JsSpider-StatsGov/issues/45
    if (r.polygon !== 'EMPTY'){
        r.polygon = r.polygon.split(';').map(ring => {
            const ringArray = ring.split(',').map(x => x.split(' ').map(x => Number(x)));
            ringArray.push(ringArray[0]);
            return ringArray
        })
    }
}

await fs.writeFile('./map.json', JSON.stringify(result));