import randomArrayIndex from "~/utils/common/randomArrayIndex";

export default function<T>(array: ReadonlyArray<T>): T {
    return array[randomArrayIndex(array)];
}