export const LOCALES = ["en"] as const;
export const DEFAULT_LOCALE = LOCALES[0];

export type ILocale = (typeof LOCALES)[number];
