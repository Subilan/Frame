import Zh from '~/static/data/languages/zh.json';
import En from '~/static/data/languages/en.json';
import type {I18n, I18nKeys} from "~/types/client";

export default function (key: I18nKeys, ...params: any[]) {
    const lang = useLanguage();
    let t: I18n | null = null;

    if (lang.value === 'zh') t = Zh as I18n;
    if (lang.value === 'en') t = En as I18n;

    if (t === null) return key;

    const path = key.split('.');
    let q: any;

    q = t;
    for (const p of path) q = q[p];

    if (typeof q === 'string') {
        if (params.length === 0) return q;

        params.forEach((param, i) => {
            q = q.replace(`$${i + 1}`, param);
        })

        return q;
    }

    return key;
}