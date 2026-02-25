export const LOCALES = ["en", "ru"] as const;
export const NAMESPACES = ["common", "translation", "@repo/ui"] as const;
export const DEFAULT_LOCALE = LOCALES[0];
export const DEFAULT_NAMESPACES = NAMESPACES;
export type ILocale = (typeof LOCALES)[number];
export type INamespace = (typeof NAMESPACES)[number];
export type IDefaultNameSpace = Exclude<INamespace, "@repo/ui">

export function isLocale(input: unknown): input is ILocale {
  return LOCALES.includes(input as ILocale);
}

export function validateLocale(input: unknown): asserts input is ILocale {
  if (!isLocale(input)) {
    throw new Error(`Invalid locale "${input}".`);
  }
}

export function isNamespace(input: unknown): input is INamespace {
  return NAMESPACES.includes(input as INamespace);
}

export function validateNamespace(input: unknown): asserts input is INamespace {
  if (!isNamespace(input)) {
    throw new Error(`Invalid namespace "${input}".`);
  }
}
