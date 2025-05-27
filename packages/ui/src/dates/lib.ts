import { TZDate } from "@date-fns/tz";
import type { IDateTime } from "./types";

export function now(): string {
  const timestamp = toISODateTime(new TZDate());

  return timestamp;
}

export function toISODateTime(date: Date) {
  const timestamp = date.toISOString();

  return timestamp;
}

export function toJavascriptDate(dateTime: IDateTime): TZDate {
  const date = new TZDate(dateTime);

  return date;
}
