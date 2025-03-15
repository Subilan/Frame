import type { NGReason } from "~/types/server";
import resp from "~/utils/server/resp";

export default function (reason: NGReason) {
    return resp('ng', reason)
}