import { toZonedTime } from "date-fns-tz";

export function ConvertDateTime(dateTimeString: string) :Date {
    const dataUtc = toZonedTime(dateTimeString, 'America/Sao_Paulo');

    return dataUtc;
}