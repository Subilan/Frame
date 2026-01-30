import { useMemo } from 'react';
import { getTypedCaptions, type CaptionItem } from '~/consts';

export const CaptionKeyPrefix = 'public/frame/';

export default function useCaptions(name: string) {
	const captions = getTypedCaptions();
	return useMemo(() => {
		const tg = captions[name];
        if (!tg) return {};
		return Object.fromEntries(
			Object.entries(tg).map(([k, v]) => {
				return [CaptionKeyPrefix + name + '/' + k, v];
			})
		);
	}, [name]);
}
