import {getQuery} from "h3";
import getExifByName from "@/server/utils/getExifByName";

export default defineEventHandler(e => {
    const query = getQuery(e);
    let name = suspect(query.name as string, '');

    if (name === '') return ng('invalid parameter');

    name = atob(name);

    const res = getExifByName(name);
    if (res === null) return ng('nothing');

    return res.exif;
})