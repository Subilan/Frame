export default function (objectPath: string) {
    const res = /public\/frame\/([A-Za-z0-9_\-]+)\/([A-Za-z0-9_\-\.]+)/.exec(objectPath);

    if (res === null) return null;

    return buildViewerPath(res[1], res[2]);
}