import type { ILocale } from "#lib/internationalization";
import type engJSON from "../../../localization/en.json";

export type ILocalization = typeof engJSON;
export type ILocalizationCommon = ILocalization["common"];
export type ILocalizationPage = ILocalization["pages"];
export type ILocalizationEntities = ILocalization["entities"];

export type IPageLocalization<Page extends keyof ILocalizationPage> = {
  lang: ILocale;
  common: ILocalizationCommon;
  t: ILocalizationPage[Page];
};

const dictionaries = {
  en: async () => {
    const dictModule = await import("../../../localization/en.json");
    return dictModule.default;
  },
  ru: async () => {
    const dictModule = await import("../../../localization/ru.json");
    return dictModule.default;
  },
};

export async function getDictionary(locale: keyof typeof dictionaries) {
  return await dictionaries[locale]();
}
