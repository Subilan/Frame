import collections from '@/static/data/collections.json';
import type {CollectionInfo} from "~/types";

export default function (name: string): CollectionInfo | null {
    const res = collections.filter(x => x.ossPrefix === name);
    if (res.length > 0) return res[0];
    return null;
}