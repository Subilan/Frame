import type { Lang } from "~/types/client";
import type { CategoryType } from "~/types/common/objects";

export default function (categoryType: CategoryType): Lang<string> {
    const obj: Lang<string> = {
        zh: '',
        en: ''
    };
    
    switch (categoryType) {
        case 'date':{
            obj.zh = '日期';
            obj.en = 'date';
            break;
        }

        case 'region': {
            obj.zh = '地区';
            obj.en = 'region';
            break;
        }

        case 'road': {
            obj.zh = '公路';
            obj.en = 'road';
            break;
        }

        case 'spot': {
            obj.zh = '特定地点';
            obj.en = 'spot';
            break;
        }

        case 'subway': {
            obj.zh = '地铁站';
            obj.en = 'subway station';
            break;
        }

        case 'transportation': {
            obj.zh = '交通设施';
            obj.en = 'transportation infrasture';
        }
    }

    return obj;
}