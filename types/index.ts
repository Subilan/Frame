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

export type Delayed<T = any> = {loading: true, data: {}} | {loading: false, data: T};

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
