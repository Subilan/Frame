import getFrameUrlFromOssUrl from "~/utils/getFrameUrlFromOssUrl";

export default function getFrameUrlFromSimpleRepr(simpleRepr: string) {
    return getFrameUrlFromOssUrl(`public/frame/${simpleRepr}`);
}