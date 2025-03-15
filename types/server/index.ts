import type { CollectionName, SpecialSpot } from "../common/objects";

export type NGReason = 'invalid parameter' | 'nothing' | 'bad process';

export type StoreItem = {
	name: string,
	url: string,
	size: number,
	collection: CollectionName | '',
	navigation: {
		prev: string | null,
		next: string | null
	},
	meta: {
		date?: string,
		coordinates: {
			lng: number[],
			lat: number[]
		},
		wgs84: number[],
		timeOffset: string,
		dimension: {
			h: number,
			w: number
		},
		device: string,
		filesize: number,
		lens: {
			focalLength: number,
			aperature: number
		},
		gpsspeed: number,
		exposureTime: string,
		altitude: number
	},
	special: SpecialSpot[],
	captions: string,
	geo?: {
		name: string,
		ext_path: string,
		en_name?: string,
		en_ext_path?: string
	}
}

export type Store = StoreItem[];