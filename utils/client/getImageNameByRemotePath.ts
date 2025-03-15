export default function(remotePath: string) {
    const res = /public\/frame\/[A-Za-z0-9_-]+\/([A-Za-z0-9\._\-]+)/.exec(remotePath);

    if (res === null) return '';
    return res[1];
}