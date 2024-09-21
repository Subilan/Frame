import specialSpots from "@/static/data/special-spots.json";
import {SpecialSpot} from "@/types";
import getExifByName from "@/server/utils/getExifByName";
import translateExifDate from "@/utils/translateExifDate";
import getDayjs from "~/utils/getDayjs";

function spotIncludesName(name: string, spot: SpecialSpot) {
    if (spot.includes) return spot.includes.some(x => name.includes(x));
    if (Array.isArray(spot.timeRange)) {
        const exif = getExifByName(name);
        if (exif === null) return false;

        return spot.timeRange.some(x => {
            const startAt = getDayjs().tz(x[0], "Asia/Shanghai");
            const endAt = getDayjs().tz(x[1], "Asia/Shanghai");
            const translated = translateExifDate(exif.exif.DateTime.value);

            if (translated === null) return false;
            return translated.isBetween(startAt, endAt)
        })
    }
    return false;
}

export default defineEventHandler(e => {
    const query = getQuery(e);
    let name = suspect(query.name as string, '');
    const specialSpotsT = specialSpots as SpecialSpot[];

    if (name === '') return ng('nothing');

    name = atob(name);

    return ok(specialSpotsT.filter(x => spotIncludesName(name, x)));
})