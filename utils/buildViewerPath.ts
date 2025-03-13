import {OSSEndpoint} from "~/consts";
import buildObjectPath from "~/utils/buildObjectPath";

export default function (category: string, filename: string) {
    return `/view/${category}/${filename}`;
}