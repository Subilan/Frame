/**
 * 根据 OSS 完整对象路径（如 public/frame/dawanqu/2023/xxx.jpg）
 * 得到相册页面锚点链接（如 /collection/dawanqu/2023#xxx.jpg）
 */
export default function getFrameUrlFromName(name: string) {
	const res = /public\/frame\/([A-Za-z0-9\-\/]+)\/([^/]+)$/.exec(name);

	if (res === null) return '';

	return `/collection/${res[1]}#${res[2]}`;
}
