import type { FrameResp } from "~/types";

export default async function <T>(relativePath: string) {
    return await $fetch<FrameResp<T>>(relativePath);
}
