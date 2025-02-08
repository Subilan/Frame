import randomArrayIndex from "~/utils/randomArrayIndex";

export default function<T>(array: T[]): T {
    return array[randomArrayIndex(array)];
}