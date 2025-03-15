import type { CollectionKeys } from "~/server/consts";

export interface Exif {
	ApertureValue: {
		value: string;
	};
	BrightnessValue: {
		value: string;
	};
	ColorSpace: {
		value: string;
	};
	CompositeImage: {
		value: string;
	};
	DateTime: {
		value: string;
	};
	DateTimeDigitized: {
		value: string;
	};
	DateTimeOriginal: {
		value: string;
	};
	DigitalZoomRatio: {
		value: string;
	};
	ExifTag: {
		value: string;
	};
	ExifVersion: {
		value: string;
	};
	ExposureBiasValue: {
		value: string;
	};
	ExposureMode: {
		value: string;
	};
	ExposureProgram: {
		value: string;
	};
	ExposureTime: {
		value: string;
	};
	FNumber: {
		value: string;
	};
	FileSize: {
		value: string;
	};
	Flash: {
		value: string;
	};
	FocalLength: {
		value: string;
	};
	FocalLengthIn35mmFilm: {
		value: string;
	};
	Format: {
		value: string;
	};
	FrameCount: {
		value: string;
	};
	GPSAltitude: {
		value: string;
	};
	GPSAltitudeRef: {
		value: string;
	};
	GPSDateStamp: {
		value: string;
	};
	GPSDestBearing: {
		value: string;
	};
	GPSDestBearingRef: {
		value: string;
	};
	GPSHPositioningError: {
		value: string;
	};
	GPSImgDirection: {
		value: string;
	};
	GPSImgDirectionRef: {
		value: string;
	};
	GPSLatitude: {
		value: string;
	};
	GPSLatitudeRef: {
		value: string;
	};
	GPSLongitude: {
		value: string;
	};
	GPSLongitudeRef: {
		value: string;
	};
	GPSSpeed: {
		value: string;
	};
	GPSSpeedRef: {
		value: string;
	};
	GPSTag: {
		value: string;
	};
	GPSTimeStamp: {
		value: string;
	};
	HostComputer: {
		value: string;
	};
	ISOSpeedRatings: {
		value: string;
	};
	ImageHeight: {
		value: string;
	};
	ImageWidth: {
		value: string;
	};
	LensMake: {
		value: string;
	};
	LensModel: {
		value: string;
	};
	LensSpecification: {
		value: string;
	};
	Make: {
		value: string;
	};
	MakerNote: {
		value: string;
	};
	MeteringMode: {
		value: string;
	};
	Model: {
		value: string;
	};
	OffsetTime: {
		value: string;
	};
	OffsetTimeDigitized: {
		value: string;
	};
	OffsetTimeOriginal: {
		value: string;
	};
	Orientation: {
		value: string;
	};
	PixelXDimension: {
		value: string;
	};
	PixelYDimension: {
		value: string;
	};
	ResolutionUnit: {
		value: string;
	};
	SceneType: {
		value: string;
	};
	SensingMethod: {
		value: string;
	};
	ShutterSpeedValue: {
		value: string;
	};
	Software: {
		value: string;
	};
	SourceExposureTimesOfCompositeImage: {
		value: string;
	};
	SourceImageNumberOfCompositeImage: {
		value: string;
	};
	SubSecTimeDigitized: {
		value: string;
	};
	SubSecTimeOriginal: {
		value: string;
	};
	SubjectArea: {
		value: string;
	};
	WhiteBalance: {
		value: string;
	};
	XResolution: {
		value: string;
	};
	YResolution: {
		value: string;
	};
}

export interface Geo {
	id: number;
	pid: number;
	deep: number;
	name: string;
	en_name?: string;
	ext_path: string;
	en_ext_path?: string;
	geo: string;
	polygon: number[][][];
}

export type CollectionDataBody = {
	name: string;
	url: string;
	lastModified: string;
	etag: string;
	type: string;
	size: number;
	storageClass: string;
	owner: any;
};

export type CollectionName = typeof CollectionKeys[number];

export interface Filetrees {
	collections: Record<CollectionName, { files: CollectionDataBody[]; totalSize: number }>;
	totalSize: number;
}

interface SpecialSpotBase {
	includes?: string[];
	timeRange?: string[][];
}

export interface SpecialSpotDefault extends SpecialSpotBase {
	type: 'spot' | 'road';
	name: string;
	en_name?: string;
}

export interface SpecialSpotFlight extends SpecialSpotBase {
	type: 'flight';
}

export interface SpecialSpotSubwayStation extends SpecialSpotBase {
	type: 'subway-station';
	line: string;
	station: string;
}

export type SpecialSpot = SpecialSpotDefault | SpecialSpotFlight | SpecialSpotSubwayStation;

export type Captions = { [prop: string]: string[] | string };

export type ManualGeo = {
	name: string,
	ext_path: string,
	includes: string[]
}
