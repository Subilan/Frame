import { useMemo } from 'react';
import filetrees from '~/data/filetrees_merged.json';

export type FileTreeItem = (typeof filetrees.collections)['dawanqu/2017'];
export type FileTreeCollections = Record<string, FileTreeItem>;

export default function useFiletree(collectionName: string) {
	return useMemo(() => getFiletree(collectionName), [collectionName]);
}

export function getFiletree(collectionName: string): FileTreeItem | undefined {
	return (filetrees.collections as FileTreeCollections)[collectionName];
}
