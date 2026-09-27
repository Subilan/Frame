export interface ExifWrapper {
  name: string;
  exif: Exif;
}

export interface Exif {
  ApertureValue: ExifValue;
  BrightnessValue: ExifValue;
  ColorSpace: ExifValue;
  CompositeImage?: ExifValue;
  DateTime: ExifValue;
  DateTimeDigitized: ExifValue;
  DateTimeOriginal: ExifValue;
  ExifTag: ExifValue;
  ExifVersion: ExifValue;
  ExposureBiasValue: ExifValue;
  ExposureMode: ExifValue;
  ExposureProgram: ExifValue;
  ExposureTime: ExifValue;
  FNumber: ExifValue;
  FileSize: ExifValue;
  Flash: ExifValue;
  FocalLength: ExifValue;
  FocalLengthIn35mmFilm: ExifValue;
  Format: ExifValue;
  FrameCount: ExifValue;
  GPSAltitude?: ExifValue;
  GPSAltitudeRef?: ExifValue;
  GPSDateStamp?: ExifValue;
  GPSDestBearing?: ExifValue;
  GPSDestBearingRef?: ExifValue;
  GPSHPositioningError?: ExifValue;
  GPSImgDirection?: ExifValue;
  GPSImgDirectionRef?: ExifValue;
  GPSLatitude?: ExifValue;
  GPSLatitudeRef?: ExifValue;
  GPSLongitude?: ExifValue;
  GPSLongitudeRef?: ExifValue;
  GPSSpeed?: ExifValue;
  GPSSpeedRef?: ExifValue;
  GPSTag?: ExifValue;
  GPSTimeStamp?: ExifValue;
  HostComputer?: ExifValue;
  ISOSpeedRatings: ExifValue;
  ImageHeight: ExifValue;
  ImageWidth: ExifValue;
  LensMake: ExifValue;
  LensModel: ExifValue;
  LensSpecification: ExifValue;
  Make: ExifValue;
  MakerNote: ExifValue;
  MeteringMode: ExifValue;
  Model: ExifValue;
  OffsetTime?: ExifValue;
  OffsetTimeDigitized?: ExifValue;
  OffsetTimeOriginal?: ExifValue;
  Orientation: ExifValue;
  PixelXDimension: ExifValue;
  PixelYDimension: ExifValue;
  ResolutionUnit: ExifValue;
  SceneType: ExifValue;
  SensingMethod: ExifValue;
  ShutterSpeedValue: ExifValue;
  Software: ExifValue;
  SubSecTimeDigitized: ExifValue;
  SubSecTimeOriginal: ExifValue;
  SubjectArea?: ExifValue;
  WhiteBalance: ExifValue;
  XResolution: ExifValue;
  YResolution: ExifValue;
  TileLength?: ExifValue;
  TileWidth?: ExifValue;
  DigitalZoomRatio?: ExifValue;
  ComponentsConfiguration?: ExifValue;
  Compression?: ExifValue;
  FlashpixVersion?: ExifValue;
  JPEGInterchangeFormat?: ExifValue;
  JPEGInterchangeFormatLength?: ExifValue;
  SceneCaptureType?: ExifValue;
  YCbCrPositioning?: ExifValue;
  SourceExposureTimesOfCompositeImage?: ExifValue;
  SourceImageNumberOfCompositeImage?: ExifValue;
  GPSVersionID?: ExifValue;
}

export interface ExifValue {
  value: string;
}