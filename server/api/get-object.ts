import getCollection from "@/server/utils/getCollection";

export default defineEventHandler(e => {
    const query = getQuery(e);
    let remotePath = suspect(query.remotePath as string, '');

    if (remotePath === '') return ng('invalid parameter');

    remotePath = atob(remotePath);

    const collectionSum = getCollection();

    if (collectionSum === null) return ng("nothing");

    const res = collectionSum.files.filter(x => x.name === remotePath);

    if (res.length === 0) return ng("nothing");

    return res[0];
})