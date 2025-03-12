import { Filetrees } from "~/types";

export default async function () {
    const filetrees = await getJson('filetrees.json') as Filetrees;
    const pages: string[] = [];

    for (const category of Object.values(filetrees.collections)) {
        pages.push(...category.files.map(f => f.name))
    }
}
