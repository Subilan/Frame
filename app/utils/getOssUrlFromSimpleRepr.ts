import { OSSEndpoint } from "~/consts";

export default function getOssUrlFromSimpleRepr(simpleRepr: string) {
    return `${OSSEndpoint}/public/frame/${simpleRepr}`
}