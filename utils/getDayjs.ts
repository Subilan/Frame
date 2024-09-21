import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import IsBetween from "dayjs/plugin/isBetween"
import utc from "dayjs/plugin/utc";

export default function () {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(IsBetween)
    return dayjs;
}