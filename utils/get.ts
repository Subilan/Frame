import axios from "axios";
import type {Resp} from "~/types";

export default async function (url: string) {
    return await axios.get<Resp>(url);
}