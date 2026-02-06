import type OSS from 'ali-oss';
import type { Exif } from '~/data/exifs';

export type CollectionMeta = {
	name: string;
	title: string;
	story?: string;
	description?: string;
	image: string;
	size: number;
	childSizes: Record<string, number>;
	parent?: boolean;
	featured?: boolean;
	children?: CollectionMeta[];
	level: number;
};

export type CollectionItem = OSS.ObjectMeta & {
	exif?: Exif;
	caption?: CaptionItem;
	addr?: string;
};

// 单个注解的结构
export type CaptionItem = { title?: string; content: string };

export type RegeoItem = {
	addressComponent: {
		city: string;
		province: string;
		adcode: string;
		district: string;
		towncode: string;
		streetNumber: {
			number: string;
			location: string;
			direction: string;
			distance: string;
			street: string;
		};
		country: string;
		township: string;
		seaArea?: string;
		businessAreas: Array<string>;
		building: {
			name: string;
			type: string;
		};
		neighborhood: {
			name: string;
			type: string;
		};
		citycode: string;
	};
	formatted_address: string;
};
