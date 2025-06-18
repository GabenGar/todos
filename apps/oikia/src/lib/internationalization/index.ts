import type IBaseTranslation from "#localization/en";

export const LANGUAGES = ["en", "ru"] as const;

export type ILanguage = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE = LANGUAGES[0];

export function isSupportedLanguage(input?: string): input is ILanguage {
  return !input ? false : LANGUAGES.includes(input as ILanguage);
}

export type ITranslation = typeof IBaseTranslation;

export interface ICommonTranslationProps {
  commonTranslation: ITranslation["common"]
}

export interface ITranslationPageProps<
  Page extends keyof ITranslation["pages"],
> {
  language: ILanguage;
  translation: ITranslation["pages"][Page];
}
