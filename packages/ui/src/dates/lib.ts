import { endOfTomorrow } from "date-fns";
import { TZDate } from "@date-fns/tz";
import type { IDateTime } from "./types";

export function now(): IDateTime {
  const timestamp = toISODateTime(new TZDate());

  return timestamp;
}

export function tomorrow(): IDateTime {
  const timestamp = toISODateTime(endOfTomorrow());

  return timestamp;
}

export function toISODateTime(date: Date): IDateTime {
  const timestamp = date.toISOString();

  return timestamp;
}

export function toJavascriptDate(dateTime: IDateTime): TZDate {
  const date = new TZDate(dateTime);

  return date;
}
