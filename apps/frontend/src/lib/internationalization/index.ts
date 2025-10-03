export const LOCALES = ["en", "ru"] as const;
export const DEFAULT_LOCALE = LOCALES[0];

export type ILocale = (typeof LOCALES)[number];

export function isLocale(input: unknown): input is ILocale {
  return LOCALES.includes(input as ILocale);
}

export function validateLocale(input: unknown): asserts input is ILocale {
  if (!isLocale(input)) {
    throw new Error(`Invalid locale "${input}".`);
  }
}
