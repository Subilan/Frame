export default function translateExifLensModel(lensmodel) {
    const lensModelRegex = /([\d.]+)mm f\/([\d.]+)/;
    const lensModelExecuted = lensModelRegex.exec(lensmodel ? lensmodel.value : '');

    if (lensModelExecuted !== null) {
        return {
            focalLength: Number(lensModelExecuted[1]),
            aperature: Number(lensModelExecuted[2])
        }
    }

    return {
        focalLength: -1,
        aperature: -1
    }
}