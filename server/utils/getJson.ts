import * as fs from "fs/promises";
// import path from "node:path";

// export default async function (name: string) {
//     const content = await fs.readFile(path.join(process.cwd(), 'data', name));
//     return JSON.parse(content.toString());
// }

export default async function (name: string) {
    const config = useRuntimeConfig();
    const content = await $fetch<any>((import.meta.dev ? config.public.LOCAL_BASE_URL : 'https://photos.subilan.win') + '/data/' + name);

    return content
}