
import { CollectionKeys } from "~/server/consts";
import type { Store } from "~/types/server";
import getJson from "~/utils/server/getJson";
import ng from "~/utils/server/ng";
import pick from "~/utils/server/pick";
import suspect from "~/utils/server/suspect";

export default defineEventHandler(async e => {
    const query = getQuery(e);
    let name = suspect(query.name, '') as string;

    if (name === '') return ng('invalid parameter');

    name = atob(name);

    const store = await getJson<Store>('store.json');

    const res = store.filter(x => x.name === name);

    if (res.length === 0) return ng("nothing");

    return {
        result: res[0],
        random: {
            current: pick(store.filter(x => x.collection === res[0].collection)).name,
            all: pick(store.filter(x => x.collection === pick(CollectionKeys))).name
        }
    }
})