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

// 单张照片的紧凑记录，由 build 从完整 OSS 元数据和 EXIF 投影而来
export type PhotoRecord = {
	/** OSS 上的完整对象路径，如 public/frame/dawanqu/2023/xxx.jpg */
	name: string;
	/** EXIF DateTime 原文，如 2017:08:04 18:01:04 */
	date?: string;
	/** 拍摄时间时间戳（本地时区） */
	ts?: number;
	width?: number;
	height?: number;
	/** EXIF Orientation 数值 */
	orientation?: number;
	model?: string;
	/** 文件大小（字节） */
	size?: number;
	/** GPS 纬度原文，如 22deg 31' 49.410" */
	lat?: string;
	latRef?: 'North' | 'South';
	/** GPS 经度原文，如 113deg 58' 16.890" */
	lng?: string;
	lngRef?: 'East' | 'West';
	/** 海拔（米），已根据 GPSAltitudeRef 处理正负 */
	altitude?: number;
	/** 逆地理编码得到的地址 */
	addr?: string;
	caption?: CaptionItem;
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

export type Category = Record<string, string[]>;
