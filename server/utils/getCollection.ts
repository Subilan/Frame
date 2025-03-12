import FileTreeResultJson from '~/static/data/filetrees.json';
import { CollectionDataBody, CollectionDataKeys, Filetrees } from '~/types';

/**
 * 获取指定 tag 所表示的集合（collection）
 * @param tag 指定的 tag。如果留空，则获取所有集合的内容，不区分 tag
 */
export default function (tag = '') {
    const j = FileTreeResultJson as Filetrees;

    if (tag !== '') {
        const filteredKey = Object.keys(j.collections).filter(x => x.toLowerCase() === tag.toLowerCase());
        if (filteredKey.length === 0) return null;
        return j.collections[filteredKey[0] as CollectionDataKeys];
    }

    const result = {
        files: [] as CollectionDataBody[],
        totalSize: 0
    };

    for (let v of Object.values(j.collections)) {
        result.files.push(...v.files);
        result.totalSize += v.totalSize;
    }

    return result;
}