import { CollectionKeys } from "~/server/consts";
import type { CollectionName } from "~/types/common/objects";
import type { Store } from "~/types/server";
import getJson from "~/utils/server/getJson";
import ng from "~/utils/server/ng";
import ok from "~/utils/server/ok";
import pick from "~/utils/server/pick";
import suspect from "~/utils/server/suspect";

export default defineEventHandler(async e => {
	const query = getQuery(e);

	const scope = suspect(query.scope as CollectionName | 'all', '');

	if (scope === '') return ng('invalid parameter');

	const store = await getJson<Store>('store.json');

	let tg = pick(store.filter(x => x.collection === (scope === 'all' ? pick(CollectionKeys) : scope)));

	return ok(tg.name);
});
