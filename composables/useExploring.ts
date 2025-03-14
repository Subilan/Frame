export default function() {
    return useState<boolean>('is-exploring', () => false);
}