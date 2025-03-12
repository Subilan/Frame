import * as fs from "fs/promises";
import path from "node:path";

export default async function (name: string) {
    const content = await fs.readFile(path.join(process.cwd(), 'data', name));
    return JSON.parse(content.toString());
}