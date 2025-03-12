import captions from '~/static/data/captions.json';
import {Captions} from "~/types";

export default function (name: string) {
    const captionsT = captions as Captions;

    if (!Object.keys(captionsT).includes(name)) return "";

    const target = captionsT[name];

    if (Array.isArray(target)) {
        return target.join('');
    }

    return target;
}