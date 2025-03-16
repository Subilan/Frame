import { OSSEndpoint } from '~/consts';

export default function toURL(withoutEndpoint: string, quality = '') {
	return OSSEndpoint + `${withoutEndpoint.startsWith('/') ? '' : '/'}${withoutEndpoint}${quality.length > 0 ? '?x-oss-process=image/resize,h_' + quality : ''}`;
}
