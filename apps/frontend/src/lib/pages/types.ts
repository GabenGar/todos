import type { ParsedUrlQuery } from "node:querystring";
import type { Resource } from "i18next";
import type { ILocale } from "#lib/internationalization";

export interface ILocalizedParams extends ParsedUrlQuery {
  lang: ILocale;
}

export interface ILocalizedProps {
  lang: ILocale;
  translation: Resource;
}
