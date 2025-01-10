// https://stackoverflow.com/a/77170999
export default function () {
    const test = (force = false) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", {willReadFrequently: force});
        ctx.moveTo(0, 0), ctx.lineTo(120, 121); // HWA is bad at obliques
        ctx.stroke();
        return ctx.getImageData(0, 0, 200, 200).data.join();
    };
    return test(true) !== test(false);
}