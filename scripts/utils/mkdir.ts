import fs from 'fs/promises';

export default async function mkdir(path: string) {
	try {
		await fs.mkdir(path, {});
	} catch (e) {}
}
