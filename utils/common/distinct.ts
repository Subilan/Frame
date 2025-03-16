export default function distinct<T>(arr: T[], isSame: (current: T, inArray: T) => boolean) {
	const result: T[] = [];
	arr.forEach(x => {
		if (result.every(y => !isSame(x, y))) {
			result.push(x);
		}
	});

	return result;
}
