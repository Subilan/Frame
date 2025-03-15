
import type { Store } from "~/types/server";
import getJson from "~/utils/server/getJson";
import ng from "~/utils/server/ng";
import suspect from "~/utils/server/suspect";

export default defineEventHandler(async e => {
    const query = getQuery(e);
    let name = suspect(query.name, '') as string;

    if (name === '') return ng('invalid parameter');

    name = atob(name);

    const store = await getJson<Store>('store.json');

    const res = store.filter(x => x.name === name);

    if (res.length === 0) return ng("nothing");

    return res[0];
})