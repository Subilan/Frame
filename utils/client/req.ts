import { LocalAPIEndpoint, RemoteAPIEndpoint } from "~/consts";
import type { FrameResp } from "~/types/client";

export default async function <T>(relativePath: string) {
    return await $fetch<FrameResp<T>>((import.meta.dev ? LocalAPIEndpoint : RemoteAPIEndpoint) + relativePath);
}
