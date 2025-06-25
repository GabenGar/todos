import type IBaseTranslation from "#localization/en";

export const LANGUAGES = ["en", "ru"] as const;

export type ILanguage = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE = LANGUAGES[0];

export function isSupportedLanguage(input?: string): input is ILanguage {
  return !input ? false : LANGUAGES.includes(input as ILanguage);
}

export type ITranslation = typeof IBaseTranslation;
export type ICommonTranslation = ITranslation["common"];
export type IEntityTranslation = ITranslation["entities"];

export interface ILanguageProps {
  language: ILanguage;
}

export interface ICommonTranslationProps {
  commonTranslation: ICommonTranslation;
}

export type IEntityTranslationProps<
  EntityKey extends keyof IEntityTranslation,
> = { entityTranslation: { [Key in EntityKey]: IEntityTranslation[Key] } };

export interface ITranslationPageProps<Page extends keyof ITranslation["pages"]>
  extends ILanguageProps {
  translation: ITranslation["pages"][Page];
}

export interface ICommonTranslationPageProps<
  Page extends keyof ITranslation["pages"],
> extends ICommonTranslationProps,
    ITranslationPageProps<Page> {}
