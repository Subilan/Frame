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

export type ChronicleImage = {
	path: string;
	alt?: string;
	caption?: string;
};

export type ChronicleBlock =
	| { type: 'paragraph'; html: string }
	| { type: 'heading'; level: 2 | 3 | 4; html: string }
	| { type: 'image'; image: ChronicleImage }
	| { type: 'split'; align: 'left' | 'right'; image: ChronicleImage; text: string };

export type ChronicleItem = {
	slug: string;
	filename: string;
	title: string;
	content: ChronicleBlock[];
	collection?: string;
	imagePath?: string;
	excerpt?: string;
	imageInfo?: {
		date?: string;
	};
};

export type SimpleCollectionItem = Pick<CollectionItem, 'name' | 'url'>;

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

export type CityCategoryMeta = {
	province?: string;
};

export type CategoryMeta<T extends Record<string, any> = {}> = Record<string, T & { total: number }>;

export type Category = Record<string, SimpleCollectionItem[]>;
