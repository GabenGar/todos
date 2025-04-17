import type { IDateTime } from "./types";

export type { IDateTime } from "./types";

export { formatDateTime } from "./format";

export function toISODateTime(date: Date) {
  const timestamp = date.toISOString();

  return timestamp;
}

export function toJavascriptDate(dateTime: IDateTime): Date {
  const date = new Date(dateTime);

  return date;
}

export function now(): string {
  const date = new Date().toISOString();

  return date;
}
