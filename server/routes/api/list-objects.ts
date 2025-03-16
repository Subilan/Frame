import suspect from '~/utils/server/suspect';
import ng from '~/utils/server/ng';
import ok from '~/utils/server/ok';
import type { Store, StoreItem } from '~/types/server';
import getJson from '~/utils/server/getJson';
import tagName from '~/utils/common/tagName';
import tagIs from '~/utils/common/tagIs';
import type { CategoryType } from '~/types/common/objects';
import getDayjs from '~/utils/common/getDayjs';

export default defineEventHandler(async e => {
	const query = getQuery(e);
	const tag = suspect(query.tag as string, '');
	const startIndex = suspect(query.startIndex as number, 0);
	const limit = suspect(query.limit as number, 9999);
	const all = suspect(query.all as number, 0);

	if (limit <= 0 || startIndex < 0) {
		return ng('invalid parameter');
	}

	let store = await getJson<Store>('store.json');

	if (all > 0) {
		return ok({
			hasNext: false,
			images: store.map(x => x.name)
		});
	}

	let urls: StoreItem[] = [];

	if (tagIs(tag, 'collection')) {
		urls = store.filter(x => x.collection === tagName(tag));
	}

	if (tagIs(tag, 'category')) {
		const category = tagName(tag).split('-');
		const categoryType = category[0] as CategoryType;
		const categoryName = category.slice(1, category.length).join('-');

		switch (categoryType) {
			case 'date': {
				const date = categoryName.split('.');
				urls = store.filter(x => {
					const d = getDayjs().tz(x.meta.date, 'Asia/Shanghai');
					return d.month() + 1 === Number(date[1]) && d.year() === Number(date[0]);
				})
				break;
			}
			case 'region': {
				urls = store.filter(x => x.geo?.ext_path.includes(categoryName));
				break;
			}

			case 'road': {
				urls = store.filter(x => x.special.filter(y => y.type === 'road').some(z => z.name.toLowerCase() === categoryName));
				break;
			}

			case 'spot': {
				urls = store.filter(x => x.special.filter(y => y.type === 'spot').some(z => z.name === categoryName));
				break;
			}

			case 'subway': {
				urls = store.filter(x => x.special.filter(y => y.type === 'subway-station').some(z => z.line === categoryName));
				break;
			}
		}
	}

	const afterStartIndex = urls.map(x => x.name).slice(startIndex);

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
