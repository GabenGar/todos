export type DateTime = string;

export function toISODateTime(date: Date) {
  const timestamp = date.toISOString();

  return timestamp;
}

export function now(): string {
  const date = new Date().toISOString();

  return date;
}
