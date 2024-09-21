import getDayjs from "@/utils/getDayjs";

export default function (str: string) {
    const d = /(\d+):(\d+):(\d+) (\d+):(\d+):(\d+)/.exec(str);
    if (!d) return null;
    return getDayjs().tz(`${d[1]}-${d[2]}-${d[3]} ${d[4]}:${d[5]}:${d[6]}`, "Asia/Shanghai");
}