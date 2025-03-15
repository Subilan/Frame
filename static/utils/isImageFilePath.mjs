export default function (str) {
    const s = str.toLowerCase();
    return s.endsWith('jpg') || s.endsWith('jpeg') || s.endsWith('png') || s.endsWith('webp')
}