/**
 * Compile GeoJson
 *
 * 对获取到的 geojson 数据进行预处理，转换为程序可以识别的形式。
 *
 * GeoJson 来源：https://github.com/xiangyuecn/AreaCity-JsSpider-StatsGov
 */

import {exists} from "./utils/exists.mjs";
import fs from "fs/promises";

if (!(await exists( './map.geojson'))) {
    console.log('could not find target file map.geojson in current directory');
    process.exit();
}

const geoContent = await fs.readFile('./map.geojson');
const geoContentParsed = JSON.parse(geoContent.toString());

const features = geoContentParsed.features;

let result = [];

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

result = result.filter(x => !x.ext_path.includes('香港'))

const hkGeo = await fs.readFile('./hk.geojson');
const hkGeoParsed = JSON.parse(hkGeo.toString());

const hkFeatures = hkGeoParsed.features;

hkFeatures.forEach(x => {
    result.push({
        id: x.properties.POLYGONID,
        pid: -1,
        deep: 2,
        name: x.properties.CNAME,
        en_name: x.properties.ENAME,
        ext_path: `香港特别行政区 ${x.properties.CNAME}`,
        en_ext_path: x.properties.ENAME + ", Hong Kong SAR",
        geo: 0,
        polygon: x.geometry.coordinates
    });
})

let count = 1;
for (let i = 0; i <= result.length; i+= 1000) {
    await fs.writeFile(`./map-${count}.json`, JSON.stringify(result.slice(i, Math.min(i+1000, result.length))));
    count++;
}

