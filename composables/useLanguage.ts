export default function() {
    return useCookie<'zh' | 'en'>('the-frame-language', {
        default: () => 'zh'
    });
}