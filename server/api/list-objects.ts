import ng from "@/server/utils/ng";

export default defineEventHandler(e => {
    const query = getQuery(e);
    const tag = suspect(query.tag as string, '');
    const startIndex = suspect(query.startIndex as number, 0);
    const limit = suspect(query.limit as number, 20);

    if (limit <= 0 || startIndex < 0) {
        return ng('invalid parameter');
    }

    const collection = getCollection(tag);
    if (collection === null) return ng('nothing');

    const afterStartIndex = collection.files.slice(startIndex);

    if (afterStartIndex.length <= limit) return ok({
        hasNext: false,
        images: afterStartIndex
    });
    return ok({
        hasNext: true,
        images: afterStartIndex.slice(0, limit)
    });
})