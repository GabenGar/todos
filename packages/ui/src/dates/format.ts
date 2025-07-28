import { type DurationUnit, intervalToDuration, parseISO } from "date-fns";
import { now } from "./lib";
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

const formatRelativeDateTimeOptions: Intl.RelativeTimeFormatOptions = {
  numeric: "auto",
};

export function formatDateTime(
  locale: Intl.Locale,
  dateTime: IDateTime,
): string {
  const formatter = new Intl.DateTimeFormat(
    String(locale),
    formatDateTimeOptions,
  );

  const formattedDateTime = formatter.format(parseISO(dateTime));

  return formattedDateTime;
}

const durationUnitsOrder = [
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
] satisfies DurationUnit[];

export function formatRelativeDateTime(
  locale: Intl.Locale,
  dateTime: IDateTime,
): string {
  const formatter = new Intl.RelativeTimeFormat(
    String(locale),
    formatRelativeDateTimeOptions,
  );
  const end = parseISO(dateTime);
  const start = now();
  const duration = intervalToDuration({ start, end });
  let formattedDateTime = "unknown";

  for (const durationUnit of durationUnitsOrder) {
    const value = duration[durationUnit];

    if (!value) {
      continue;
    }

    formattedDateTime = formatter.format(value, durationUnit);
    break;
  }

  return formattedDateTime;
}
