import { useMemo } from 'react';
import collections from '~/data/collections.json';

export type Collection = {
	name: string;
	title: string;
	locations?: string | string[];
	featured?: boolean;
	description?: string;
	image: string;
} & ({ parent: true; children: Collection[] } | { parent?: false });

export default function useCollection(name: string) {
	return useMemo<Collection | undefined>(() => {
		if (!name.includes('/')) {
			return collections.find(x => x.name === name);
		}

		const splitted = name.split('/');

		if (splitted.length !== 2) return undefined;

		return collections.find(x => x.name === splitted[0])?.children?.find(y => y.name === splitted[1]);
	}, [name]);
}
