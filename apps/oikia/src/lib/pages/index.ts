import type { Resource } from "i18next";
import type { ILocale } from "#translation/lib";

export interface ILocalizedProps {
  language: ILocale;
  translation: Resource;
}

export interface ILocalizedArgs {
  params: {
    language: string;
  };
}
