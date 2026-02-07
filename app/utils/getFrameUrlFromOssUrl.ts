export default function getFrameUrlFromOssUrl(ossUrl: string) {
	const res = /public\/frame\/([A-Za-z0-9\-\/]+)\/(.*)$/.exec(ossUrl);

	if (res === null) return '';

	return `/collection/${res[1]}#${res[2]}`;
}
