import { Filetrees } from "~/types";
import getCollectionNameByRemotePath from "~/utils/getCollectionNameByRemotePath";
import getJson from "../utils/getJson";

export default defineEventHandler(async e => {
	const query = getQuery(e);

  let name = suspect(query.remotePath as string, '');

  if (name === '') return ng('invalid parameter');

  name = atob(name);

  const collectionName = getCollectionNameByRemotePath(name);

  if (collectionName === '') return ng('bad process');

  const filetree = await getJson('filetrees.json') as Filetrees;

  const tg = filetree.collections[collectionName].files;
  const currentIndex = tg.indexOf(tg.filter(x => x.name === name)[0]);

  const prev = Math.max(0, currentIndex - 1);
  const next = Math.min(tg.length - 1, currentIndex + 1);

  return ok({
    prev: currentIndex === prev ? null : tg[prev].name,
    next: currentIndex === next ? null : tg[next].name
  })
});
