import type { ParsedUrlQuery } from "node:querystring";
import type { ILocale } from "#lib/internationalization";
import type { ILocalizationCommon, ILocalizationPage } from "#lib/localization";

export interface ILocalizedParams extends ParsedUrlQuery {
  lang: ILocale;
}

export interface ILocalizedProps<
  Page extends keyof ILocalizationPage = keyof ILocalizationPage,
> {
  translation: {
    lang: ILocale;
    common: ILocalizationCommon;
    t: ILocalizationPage[Page];
  };
}
