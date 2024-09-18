import {getQuery} from "h3";
import exifs from '@/server/data/exifs.json';

export default defineEventHandler(e => {
    const query = getQuery(e);
    let name = suspect(query.name as string, '');

    if (name === '') return ng('invalid parameter');

    name = atob(name);

    const res = exifs.filter(x => x.name === name);
    if (res.length === 0) return ng('nothing');

    return res[0].exif;
})