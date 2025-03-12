import { Filetrees } from "~/types";

export default defineEventHandler(async () => {
    const filetrees = await getJson('filetrees.json') as Filetrees;
    const pages: string[] = [];

    for (const category of Object.values(filetrees.collections)) {
        if (category.files[0].name.includes('about')) continue;
        pages.push(...category.files.map(f => `/view/${f.name}`))
    }

    return pages;
})