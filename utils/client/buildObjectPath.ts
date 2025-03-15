import {OSSEndpoint} from "~/consts";

export default function (collection: string, objectName: string, quality: string = '', endpoint: string = OSSEndpoint, removeLeadingSlash = false) {
    const res = `${endpoint}/public/frame/${collection}/${objectName}${quality.length > 0 ? '?x-oss-process=image/resize,h_' + quality : ''}`;

    if (removeLeadingSlash) return res.slice(1, res.length);
    return res;
}