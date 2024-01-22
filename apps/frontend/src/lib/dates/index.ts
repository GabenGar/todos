export type IDateTime = string;

export function toISODateTime(date: Date) {
  const timestamp = date.toISOString();

  return timestamp;
}

export function now(): string {
  const date = new Date().toISOString();

  return date;
}

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
export function formatDateTime(locale: Intl.Locale, dateTime: IDateTime) {
  const formatter = new Intl.DateTimeFormat(
    String(locale),
    formatDateTimeOptions,
  );
  const formattedDateTime = formatter.format(new Date(dateTime));

  return formattedDateTime;
}
