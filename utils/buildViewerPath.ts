import {OSSEndpoint} from "~/consts";
import buildObjectPath from "~/utils/buildObjectPath";

export default function (prefix: string, objectName: string) {
    return buildObjectPath(prefix, objectName, '', '/view');
}