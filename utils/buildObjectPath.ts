import {OSSEndpoint} from "~/consts";

export default function (collection: string, objectName: string, quality: string = '', endpoint: string = OSSEndpoint) {
    return `${endpoint}/public/frame/${collection}/${objectName}${quality.length > 0 ? '?x-oss-process=image/resize,h_' + quality : ''}`;
}