import type { FrameResp } from "~/types";

export default async function <T>(relativePath: string): Promise<FrameResp<T>> {
    return await $fetch<FrameResp<T>>(import.meta.dev ? '' : 'https://photos.subilan.win' + relativePath);
}
