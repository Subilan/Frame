import exifs from "@/static/data/exifs.json";
import {Exif} from "~/types";

export default function (name: string): null | {
    name: string,
    exif: Exif
} {
    const res = exifs.filter(x => x.name === name);
    if (res.length === 0) return null;
    // @ts-ignore
    return res[0];
}