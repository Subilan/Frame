import resp from "~/server/utils/resp";

export default function (data: any) {
    return resp('ok', data);
}