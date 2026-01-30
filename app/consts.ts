import captions from '~/data/captions.json';

export type CaptionItem = { title?: string; content: string };
export const OSSEndpoint = 'https://fnmdp.oss-cn-beijing.aliyuncs.com';

export function getTypedCaptions() {
	return captions as Record<string, Record<string, CaptionItem>>;
}