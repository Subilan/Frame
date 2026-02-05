import type OSS from 'ali-oss';
import type { Exif } from '~/data/exifs';

export type TraverseTarget = {
	name: string;
	children?: TraverseTarget[];
};

export type CollectionMeta = {
	name: string;
	title: string;
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
