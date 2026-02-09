const regex = /^(\d+):(\d+):(\d+) (\d+):(\d+):(\d+)$/

export default function parseExifTime(time: string) {
    const res = regex.exec(time);

    if (res === null) return undefined;

    return new Date(+res[1], +res[2] - 1, +res[3], +res[4], +res[5], +res[6]);
}