import {OSSEndpoint} from "~/consts";

export default function (prefix: string, objectName: string, quality: string = '', endpoint: string = OSSEndpoint) {
    return `${endpoint}/public/frame/${prefix}/${objectName}${quality.length > 0 ? '?x-oss-process=image/resize,h_' + quality : ''}`;
}