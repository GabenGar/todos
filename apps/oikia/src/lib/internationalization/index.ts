export const LOCALES = ["en"] as const;

export type ILocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE = LOCALES[0];
