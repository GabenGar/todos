export const LOCALES = ["en", "ru"] as const;
export const BASE_NAMESPACES = ["translation", "@repo/ui"] as const;
export const DEFAULT_LOCALE = LOCALES[0];
export const DEFAULT_NAMESPACES = BASE_NAMESPACES;
export const NAMESPACES = BASE_NAMESPACES ;
export type ILocale = (typeof LOCALES)[number];
export type IBaseNamespace = (typeof BASE_NAMESPACES)[number];
export type INameSpace = IBaseNamespace;

export type IDefaultNamespace = Exclude<IBaseNamespace, "@repo/ui">;
export type IActionableNameSpace = IDefaultNamespace;

export function isLocale(input: unknown): input is ILocale {
  return LOCALES.includes(input as ILocale);
}

export function validateLocale(input: unknown): asserts input is ILocale {
  if (!isLocale(input)) {
    throw new Error(`Invalid locale "${input}".`);
  }
}

export function isNamespace(input: unknown): input is INameSpace {
  return NAMESPACES.includes(input as INameSpace);
}

export function validateNamespace(input: unknown): asserts input is INameSpace {
  if (!isNamespace(input)) {
    throw new Error(`Invalid namespace "${input}".`);
  }
}
