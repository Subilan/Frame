import isImageFilePath from "~/server/utils/isImageFilePath";
import getFileDateFromName from "~/server/utils/getFileDateFromName";
import {useRequestBody} from "nitropack/runtime/utils";
import suspect from "~/server/utils/suspect";

async function getList(continuationToken: string, limit: number = 20) {
    const client = getOSSClient();

    return
}

export default defineEventHandler(async e => {
    const query = getQuery(e);
    let continuationToken = suspect(query.nextToken as string, '');
    const result = [];

    if (query.all === true) {

    } else {
        let res = await getList('', suspect(query.limit as number, 20));
        result.push(...res.objects);

        if (res.isTruncated) continuationToken = res.nextContinuationToken;
    }

    return {
        data:
        nextToken: continuationToken
    }
})