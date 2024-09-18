import axios from "axios";
import type {FrameResp} from "~/types";

export default async function (url: string) {
    return await axios.get<FrameResp>(url);
}