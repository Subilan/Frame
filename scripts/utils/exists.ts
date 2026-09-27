import fs from "fs/promises";

export default async function exists(file: string) {
    try {
        await fs.access(file, fs.constants.F_OK);
        return true;
    } catch (e) {
        return false;
    }
}