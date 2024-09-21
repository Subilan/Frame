import {OSSEndpoint} from "~/consts";

export default function (prefix: string, objectName: string) {
    return `${OSSEndpoint}/public/frame/${prefix}/${objectName}`;
}