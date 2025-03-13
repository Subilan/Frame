import type { CollectionDataKeys } from "~/types";

export default function(remotePath: string) {
    const res = /public\/frame\/([A-Za-z0-9_-]+)\/.*/.exec(remotePath);

    if (res === null) return '';
    return res[1] as CollectionDataKeys;
}