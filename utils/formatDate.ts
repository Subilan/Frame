function l(s: string | number) {
    return (s.toString().length === 1 || Number(s) < 10) ? `0${s}` : s;
}

export default function (date: Date) {
    return `${date.getFullYear()}/${l(date.getMonth() + 1)}/${l(date.getDate())} ${l(date.getHours())}:${l(date.getMinutes())}:${l(date.getSeconds())}`;
}