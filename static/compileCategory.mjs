/**
 * @name compileCategory
 * @description 整理多方信息，构建出时间、地区、景点、交通设施四大维度信息，写入 category.json 内
 */

import fs from 'fs/promises';
import getDayjs from './utils/getDayjs.mjs';

const dayjs = getDayjs();

const storeContent = await fs.readFile('./store.json');
const store = JSON.parse(storeContent.toString());

function getRoadLoc(road) {
	switch (road) {
		case 'g348': return '大理';
		case 'g217': return '沿线';
		case 's318': return '塔城地区';
		case 'g219': return '塔城地区';
		case 'g30': return '赛里木湖';
		default: return '';
	}
}

const result = {
	dates: [],
	regions: [],
	spots: [],
	transportation: {
		road: [],
		subwayStations: []
	}
};

const categoryDates = [];
const categoryRegions = [];
const categorySpots = [];
const categoryRoads = [];
const categorySubwayStations = [];

let c;
let target;

for (let item of store) {
	const date = dayjs.tz(item.meta.date, 'Asia/Shanghai');

	if (date.isValid()) {
		c = {
			year: date.year(),
			month: date.month() + 1
		};

		target = categoryDates.findIndex(x => x.c.year === c.year && x.c.month === c.month);

		if (target === -1)
			categoryDates.push({
				c,
				firstImage: item.name,
				count: 1
			});
		else categoryDates[target].count++;
	}

	const region = item?.geo;
	if (region) {
		c = {
			geo: region,
			isFlying: item.special.filter(x => x.type === 'flight').length > 0
		};

		target = categoryRegions.findIndex(x => x.c.geo.ext_path === c.geo.ext_path);

		if (target === -1)
			categoryRegions.push({
				c,
				firstImage: item.name,
				count: 1
			});
		else categoryRegions[target].count++;
	}

	const spot = item.special.filter(x => x.type === 'spot');
	if (spot.length > 0) {
		c = spot[0].name;

		target = categorySpots.findIndex(x => x.c === c);

		if (target === -1)
			categorySpots.push({
				c,
				firstImage: item.name,
				count: 1
			});
		else categorySpots[target].count++;
	}

	const road = item.special.filter(x => x.type === 'road');

	if (road.length > 0) {
		c = {
			name: road[0].name.toLowerCase()
		};

		c.loc = getRoadLoc(c.name);

		target = categoryRoads.findIndex(x => x.c.name === c.name);

		if (target === -1)
			categoryRoads.push({
				c,
				firstImage: item.name,
				count: 1
			});
		else categoryRoads[target].count++;
	}

	const subwayStation = item.special.filter(x => x.type === 'subway-station');
	if (subwayStation.length > 0) {
		c = {
			line: subwayStation[0].line,
			station: subwayStation[0].station,
			ext_path: item.geo.ext_path
		};

		target = categorySubwayStations.findIndex(x => x.c.line === c.line && x.c.station === c.station && x.c.ext_path === c.ext_path);

		if (target === -1)
			categorySubwayStations.push({
				c,
				firstImage: item.name,
				count: 1
			});
		else categorySubwayStations[target].count++;
	}
}

result.dates = categoryDates.sort((a, b) => a.c.year === b.c.year ? (a.c.month === b.c.month ? 0 : b.c.month - a.c.month) : b.c.year - a.c.year);
result.regions = categoryRegions;
result.spots = categorySpots;
result.transportation.road = categoryRoads;
result.transportation.subwayStations = categorySubwayStations;

await fs.writeFile('category.json', JSON.stringify(result));
