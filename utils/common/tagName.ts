export default function tagName(tag: string) {
	for (let t of ['collection', 'category']) {
		tag = tag.replace(t + '-', '');
	}

	return tag;
}
