import { type DurationUnit, intervalToDuration, parseISO } from "date-fns";
import { now } from "./lib";
import type { IDateTime } from "./types";

const formatRelativeDateTimeOptions: Intl.RelativeTimeFormatOptions = {
  numeric: "auto",
};

const durationUnitsOrder = [
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
] satisfies DurationUnit[];

export function createRelativeDateTimeFormatter(
  locale: Intl.Locale,
): (dateTime: IDateTime) => string {
  const formatter = new Intl.RelativeTimeFormat(
    String(locale),
    formatRelativeDateTimeOptions,
  );

  function formatRelativeDateTime(dateTime: IDateTime): string {
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

  return formatRelativeDateTime;
}
