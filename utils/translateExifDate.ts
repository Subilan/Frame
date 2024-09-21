export default function (str: string) {
    const datetimeExecuted = /(\d+):(\d+):(\d+) (\d+):(\d+):(\d+)/.exec(str);
    if (!datetimeExecuted) return null;
    return new Date(`${datetimeExecuted[1]}-${datetimeExecuted[2]}-${datetimeExecuted[3]}T${datetimeExecuted[4]}:${datetimeExecuted[5]}:${datetimeExecuted[6]}+08:00`);
}