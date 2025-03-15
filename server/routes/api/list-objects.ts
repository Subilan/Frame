import suspect from '~/utils/server/suspect';
import ng from '~/utils/server/ng';
import ok from '~/utils/server/ok';
import type { Store } from '~/types/server';
import getJson from '~/utils/server/getJson';

export default defineEventHandler(async e => {
	const query = getQuery(e);
	const tag = suspect(query.tag as string, '');
	const startIndex = suspect(query.startIndex as number, 0);
	const limit = suspect(query.limit as number, 20);
	const all = suspect(query.all as number, 0);

	if (limit <= 0 || startIndex < 0) {
		return ng('invalid parameter');
	}

	let store = await getJson<Store>('store.json');

	if (all > 0) {
		return ok({
			hasNext: false,
			images: store
		});
	}

    store = store.filter(x => x.collection === tag);

	const afterStartIndex = store.slice(startIndex);

	if (afterStartIndex.length <= limit)
		return ok({
			hasNext: false,
			images: afterStartIndex
		});
	return ok({
		hasNext: true,
		images: afterStartIndex.slice(0, limit)
	});
});
