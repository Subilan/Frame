export default function <T> (suspect: T, defaultValue: T) {
    if (typeof defaultValue === 'number' && isNaN(Number(suspect))) return defaultValue;
    if (suspect === undefined) return defaultValue;
    if (suspect === null) return defaultValue;
    return suspect;
}