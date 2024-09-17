import {getQuery} from "h3";
import exifs from '@/server/data/exifs.json';

export default defineEventHandler(e => {
    const query = getQuery(e);
    const name = suspect(query.name as string, '');

    if (name === '') return ng();

    const res = exifs.filter(x => x.name === name);
    if (res.length === 0) return ng();

    return res[0].exif;
})