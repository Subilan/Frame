import FileTreeResultJson from '@/static/data/filetrees.json';

export interface CollectionFile {
    name: string;
    url: string;
    lastModified: string;
    etag: string;
    type: string;
    size: number;
    storageClass: string;
    owner: null;
}

export interface CollectionContent {
    files: CollectionFile[];
    totalSize: number;
}

interface FileTree {
    collections: {
        [prop: string]: CollectionContent
    },
    totalSize: number;
}

/**
 * 获取指定 tag 所表示的集合（collection）
 * @param tag 指定的 tag。如果留空，则获取所有集合的内容，不区分 tag
 */
export default function (tag: string = '') {
    const j = FileTreeResultJson as FileTree;

    if (tag !== '') {
        const filteredKey = Object.keys(j.collections).filter(x => x.toLowerCase() === tag.toLowerCase());
        if (filteredKey.length === 0) return null;
        return j.collections[filteredKey[0]];
    }

    const result: CollectionContent = {
        files: [],
        totalSize: 0
    };

    for (let v of Object.values(j.collections)) {
        result.files.push(...v.files);
        result.totalSize += v.totalSize;
    }

    return result;
}