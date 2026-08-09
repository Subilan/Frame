import { OSSEndpoint } from "~/consts";

/**
 * 根据 OSS 完整对象路径（如 public/frame/dawanqu/2023/xxx.jpg）拼接可访问的 URL
 */
export default function getOssUrlFromName(name: string) {
	return `${OSSEndpoint}/${name}`;
}
