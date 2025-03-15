import getDayjs from "./getDayjs.mjs";

export default function spotIncludes(name, spot, jsonDate) {
    if (spot.includes) if (spot.includes.some(x => name.includes(x))) return 1;

    const dayjs = getDayjs();
    if (Array.isArray(spot.timeRange)) {

        if (!jsonDate) return false;

        return spot.timeRange.some(x => {
            const startAt = dayjs.tz(x[0], 'Asia/Shanghai');
            const endAt = dayjs.tz(x[1], 'Asia/Shanghai');
            const imageDate = dayjs(jsonDate);

            return imageDate.isBetween(startAt, endAt, null, '[]');
        });
    }

    return false;
}
