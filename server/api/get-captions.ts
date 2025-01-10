import getCaptionByName from "~/server/utils/getCaptionByName";

export default defineEventHandler(e => {
    const query = getQuery(e);
    let name = suspect(query.name as string, "");

    name = atob(name);

    if (name === '') return ng('invalid parameter');

    console.log(name)

    const caption = getCaptionByName(name);

    return ok(caption);
})