import { useMemo } from 'react';
import filetrees from '~/data/filetrees_merged.json';
import collections from '~/data/collections.json';

export default function useFiletreeLengths() {
	return useMemo(() => {
		const result: Record<string, number> = Object.fromEntries(Object.entries(filetrees.collections).map(([k, v]) => [k, v.files.length]));

		for (const collection of collections.filter(x => x.parent)) {
			let total = 0;
			for (const collectionChild of collection.children!) {
				const name = `${collection.name}/${collectionChild.name}`;
				total += result[name];
			}
			result[collection.name] = total;
		}

		return result;
	}, []);
}
