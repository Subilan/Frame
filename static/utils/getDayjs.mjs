import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import IsBetween from "dayjs/plugin/isBetween.js"
import utc from "dayjs/plugin/utc.js";

export default function () {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(IsBetween)
    return dayjs;
}