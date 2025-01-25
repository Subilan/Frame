import {Geo} from "@/types";
import * as fs from "fs/promises";
import path from "node:path";

export default async function () {
    const content = await fs.readFile(path.join(process.cwd(), '/static/data/map.json'));
    return JSON.parse(content.toString()) as Geo[];
}