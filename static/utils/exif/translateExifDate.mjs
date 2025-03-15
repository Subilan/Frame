import getDayjs from '../getDayjs.mjs';

export default function (datetime) {
    const d = /(\d+):(\d+):(\d+) (\d+):(\d+):(\d+)/.exec(datetime ? datetime.value : '');
    if (!d) return null;
    return getDayjs().tz(`${d[1]}-${d[2]}-${d[3]} ${d[4]}:${d[5]}:${d[6]}`, "Asia/Shanghai");
}