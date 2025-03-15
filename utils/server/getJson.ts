type StaticFile = 'store.json';

export default async function <T>(name: StaticFile) {
	const content = await useStorage('assets:server').getItem(name);
	return content as T;
}
