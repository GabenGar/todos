import type { IDateTime } from "./types";

const formatDateTimeOptions: Intl.DateTimeFormatOptions = {
  hour12: false,
  hourCycle: "h23",
  era: "long",
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "long",
};

export function createDateTimeFormatter(
  locale: Intl.Locale,
): (dateTime: IDateTime) => string {
  const formatter = new Intl.DateTimeFormat(
    String(locale),
    formatDateTimeOptions,
  );

  function formatDateTime(dateTime: IDateTime) {
    const formattedDateTime = formatter.format(new Date(dateTime));

    return formattedDateTime;
  }

  return formatDateTime;
}
