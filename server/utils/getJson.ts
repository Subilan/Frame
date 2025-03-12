import * as fs from "fs/promises";
import path from "node:path";

export default async function (name: string) {
    const content = await fs.readFile(process.cwd() + '/data/' + name);
    return JSON.parse(content.toString());
}