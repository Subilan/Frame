export default function isImageFilePath(str: string) {
	const s = str.toLowerCase();
	return s.endsWith('jpg') || s.endsWith('jpeg') || s.endsWith('png') || s.endsWith('webp');
}
