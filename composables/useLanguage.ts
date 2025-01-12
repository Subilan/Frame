export default function() {
    return useState<'zh' | 'en'>('language', () => 'zh');
}