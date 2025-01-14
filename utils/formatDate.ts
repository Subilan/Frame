export default function(str: string) {
    return getDayjs().tz(str, 'Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
}