import fs from "fs/promises";

export async function exists(file) {
    try {
        await fs.access(file, fs.constants.F_OK);
        return true;
    } catch (e) {
        return false;
    }
}