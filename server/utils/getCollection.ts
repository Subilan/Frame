import FileTreeResultJson from '@/server/data/filetrees.json';

export interface CollectionFile {
    name:         string;
    url:          string;
    lastModified: string;
    etag:         string;
    type:         string;
    size:         number;
    storageClass: string;
    owner:        null;
}

export interface Collection {
    files: CollectionFile[];
    totalSize: number;
}

export interface CollectionResult {
    collections: {
        [prop: string]: Collection
    },
    totalSize: number;
}

export default function (tag: string) {
    const j = FileTreeResultJson as CollectionResult;
    const filteredKey = Object.keys(j.collections).filter(x => x.toLowerCase() === tag.toLowerCase());
    if (filteredKey.length === 0) return null;
    return j.collections[filteredKey[0]];
}