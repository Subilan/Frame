import collections from '@/static/data/collections.json';

export default function (name: string) {
    const res = collections.filter(x => x.ossPrefix === name);
    if (res.length > 0) return res[0];
    return null;
}