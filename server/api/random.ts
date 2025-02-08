import { CollectionDataKeys, Filetrees } from '~/types';
import pick from '../utils/pick';

export default defineEventHandler(async e => {
	const query = getQuery(e);

	const scope = suspect(query.scope as CollectionDataKeys | 'all', '');

	if (scope === '') return ng('invalid parameter');

	const filetree = (await getJson('filetrees.json')) as Filetrees;

	let tg;

	if (scope === 'all') tg = filetree.collections[pick(Object.keys(filetree.collections).filter(x => x !== 'about') as CollectionDataKeys[])];
	else tg = filetree.collections[scope];

	const tgFile = pick(tg.files);

	return ok(tgFile);
});
