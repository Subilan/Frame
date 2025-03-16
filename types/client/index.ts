import type { NGReason, StoreItem } from "../server";

interface RespOK<T = any> {
	code: 'ok';
	data: T;
}

interface RespNG {
	code: 'ng';
	data: NGReason;
}

export type FrameResp<T = any> = RespOK<T> | RespNG;

export type Delayed<T = any> = { loading: boolean; data: T };

export type Lang<T> = { zh: T; en: T };

export type Nullable<T> = T | null;

export type NullableString = Nullable<string>;

export interface CollectionInfo {
	name: Lang<string>;
	date: Lang<string>;
	ossPrefix: string;
	totalSize: number;
	totalAmount: number;
	banner: string;
	desc: Lang<string>;
	external: { type: 'article' | 'video'; name: Lang<string>; href: string }[];
	theme?: string;
	pickedAmount: number;
}

export type I18n = {
	collectionView: {
		externalLinks: string;
		viewNow: string;
		noContent: string;
		loading: string;
		loadingPhotos: string;
		fourOfour: {
			title: string;
			text: string;
			goBack: string;
		};
	};
	collection: {
		photoNum: string;
		photoIsPicked: string;
		readExternal: string;
		watchExternal: string;
	};
	collections: {
		photoShownNum: string;
		photoTotalNum: string;
	};
	view: {
		viewDetails: string;
		loadOriginal: string;
		download: string;
		enterFullscreen: string;
		details: {
			captions: string;
			shotAt: string;
			shotOn: string;
			resolution: string;
			size: string;
			timezone: string;
			focalLength: string;
			aperature: string;
			exposureTime: string;
			location: string;
			latitude: string;
			longitude: string;
			altitude: string;
			speed: string;
			inflight: string;
			inflightNote: string;
			loadingLocation: string;
		};
		hwaWarning: string;
		aboutGPSInformation: string;
		noGPS: string;
		gpsSpeedZero: string;
		navigationPanel: {
			random: string;
			next: string;
			prev: string;
			inAll: string;
			inCollection: string;
			backToCollection: string;
		};
	};
	index: {
		shotOn: string;
		shotAt: string;
		altitude: string;
		nextImage: string;
		viewImage: string;
		seeCollections: string;
	};
	mobileNavigation: {
		viewer: string;
		home: string
	};
};

type Leaves<T> = T extends object
	? {
			[K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? '' : `.${Leaves<T[K]>}`}`;
	  }[keyof T]
	: never;

export type I18nKeys = Leaves<I18n>;

export type HomeBannerItem = {
	ossPrefix: string;
	image: string;
	name: string | Lang<string>;
	meta: {
		altitude?: number;
		date: string;
		device: string;
		region: Lang<string>;
	};
	story: {
		zh: string[],
		en: string[]
	}
	dark?: boolean;
};

export type NavigationItem = {
	external: boolean;
	to: string;
	text: Lang<string>;
};

export type Langs = 'en' | 'zh';

export type ResponseStoreItem = {
	result: StoreItem,
	random: {
		current: string,
		all: string
	}
}
