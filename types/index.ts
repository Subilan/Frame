interface RespOK<T = any> {
    code: 'ok',
    data: T
}

interface RespNG {
    code: 'ng',
    data: NGReason
}

export type NGReason = 'invalid parameter' | 'nothing';

export type FrameResp<T = any> = RespOK<T> | RespNG;

export type Delayed<T = any> = {loading: boolean, data: T}

export type Lang<T> = { zh: T, en: T }

export interface Exif {
    ApertureValue: {
        value: string
    }
    BrightnessValue: {
        value: string
    }
    ColorSpace: {
        value: string
    }
    CompositeImage: {
        value: string
    }
    DateTime: {
        value: string
    }
    DateTimeDigitized: {
        value: string
    }
    DateTimeOriginal: {
        value: string
    }
    DigitalZoomRatio: {
        value: string
    }
    ExifTag: {
        value: string
    }
    ExifVersion: {
        value: string
    }
    ExposureBiasValue: {
        value: string
    }
    ExposureMode: {
        value: string
    }
    ExposureProgram: {
        value: string
    }
    ExposureTime: {
        value: string
    }
    FNumber: {
        value: string
    }
    FileSize: {
        value: string
    }
    Flash: {
        value: string
    }
    FocalLength: {
        value: string
    }
    FocalLengthIn35mmFilm: {
        value: string
    }
    Format: {
        value: string
    }
    FrameCount: {
        value: string
    }
    GPSAltitude: {
        value: string
    }
    GPSAltitudeRef: {
        value: string
    }
    GPSDateStamp: {
        value: string
    }
    GPSDestBearing: {
        value: string
    }
    GPSDestBearingRef: {
        value: string
    }
    GPSHPositioningError: {
        value: string
    }
    GPSImgDirection: {
        value: string
    }
    GPSImgDirectionRef: {
        value: string
    }
    GPSLatitude: {
        value: string
    }
    GPSLatitudeRef: {
        value: string
    }
    GPSLongitude: {
        value: string
    }
    GPSLongitudeRef: {
        value: string
    }
    GPSSpeed: {
        value: string
    }
    GPSSpeedRef: {
        value: string
    }
    GPSTag: {
        value: string
    }
    GPSTimeStamp: {
        value: string
    }
    HostComputer: {
        value: string
    }
    ISOSpeedRatings: {
        value: string
    }
    ImageHeight: {
        value: string
    }
    ImageWidth: {
        value: string
    }
    LensMake: {
        value: string
    }
    LensModel: {
        value: string
    }
    LensSpecification: {
        value: string
    }
    Make: {
        value: string
    }
    MakerNote: {
        value: string
    }
    MeteringMode: {
        value: string
    }
    Model: {
        value: string
    }
    OffsetTime: {
        value: string
    }
    OffsetTimeDigitized: {
        value: string
    }
    OffsetTimeOriginal: {
        value: string
    }
    Orientation: {
        value: string
    }
    PixelXDimension: {
        value: string
    }
    PixelYDimension: {
        value: string
    }
    ResolutionUnit: {
        value: string
    }
    SceneType: {
        value: string
    }
    SensingMethod: {
        value: string
    }
    ShutterSpeedValue: {
        value: string
    }
    Software: {
        value: string
    }
    SourceExposureTimesOfCompositeImage: {
        value: string
    }
    SourceImageNumberOfCompositeImage: {
        value: string
    }
    SubSecTimeDigitized: {
        value: string
    }
    SubSecTimeOriginal: {
        value: string
    }
    SubjectArea: {
        value: string
    }
    WhiteBalance: {
        value: string
    }
    XResolution: {
        value: string
    }
    YResolution: {
        value: string
    }
}

export interface Geo {
    id: number,
    pid: number,
    deep: number,
    name: string,
    en_name?: string,
    ext_path: string,
    en_ext_path?: string,
    geo: string,
    polygon: number[][][]
}

export interface CollectionInfo {
    name: Lang<string>,
    date: Lang<string>,
    ossPrefix: string,
    totalSize: number,
    totalAmount: number,
    banner: string,
    desc: Lang<string>,
    external: { type: 'article' | 'video', name: Lang<string>, href: string }[],
    theme?: string,
    pickedAmount: number
}

interface SpecialSpotBase {
    includes?: string[],
    timeRange?: string[][],
}

interface SpecialSpotDefault extends SpecialSpotBase {
    type: "spot" | "road";
    name: string
}

interface SpecialSpotFlight extends SpecialSpotBase {
    type: "flight"
}

interface SpecialSpotSubwayStation extends SpecialSpotBase {
    type: 'subway-station',
    line: string,
    station: string
}

export type SpecialSpot = SpecialSpotDefault | SpecialSpotFlight | SpecialSpotSubwayStation;

export type Captions = { [prop: string]: string[] | string }

export type I18n = {
    collection: {
        photoNum: string,
        photoIsPicked: string,
        externalLinks: string,
        viewNow: string,
        noContent: string,
        loadingCollection: string,
        loadingPhotos: string,
        fourOfour: {
            title: string,
            text: string,
            goBack: string,
        },
        readExternal: string,
        watchExternal: string
    }
    collections: {
        photoShownNum: string,
        photoTotalNum: string
    }
    view: {
        viewDetails: string,
        loadOriginal: string,
        download: string,
        enterFullscreen: string,
        details: {
            captions: string,
            shotAt: string,
            shotOn: string,
            resolution: string,
            size: string,
            timezone: string,
            focalLength: string,
            aperature: string,
            exposureTime: string,
            location: string,
            latitude: string,
            longitude: string,
            altitude: string,
            speed: string,
            inflight: string,
            inflightNote: string,
            loadingLocation: string,
        }
        hwaWarning: string,
        moreInformation: {
            moveYourCursorHere: string,
            other: string,
        },
        noGPS: string
    },
    index: {
        shotOn: string,
        shotAt: string,
        altitude: string,
        nextImage: string,
        viewImage: string,
        seeCollections: string
    }
}

type Leaves<T> = T extends object ? {
    [K in keyof T]:
    `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? "" : `.${Leaves<T[K]>}`}`
}[keyof T] : never

export type I18nKeys = Leaves<I18n>;

export type HomeBannerItem = {
    ossPrefix: string
    image: string
    name: string
    meta: {
        altitude: number
        date: string
        device: string
        region: string
    }
    story: string[]
}

export type NavigationItem = {
    external: boolean,
    to: string,
    text: Lang<string>
}

export type Langs = 'en' | 'zh';