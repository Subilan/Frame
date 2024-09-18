import resp from "@/server/utils/resp";
import {NGReason} from "@/types";

export default function (reason: NGReason) {
    return resp('ng', reason)
}