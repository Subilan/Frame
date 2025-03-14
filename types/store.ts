import type { CollectionDataKeys, SpecialSpot } from "."

export type StoreItem = {
    name: string,
    url: string,
    size: number,
    collection: CollectionDataKeys | '',
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