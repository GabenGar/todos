import type engJSON from "../../../localization/en.json";

export type ILocalization = typeof engJSON;
export type ILocalizationCommon = ILocalization["common"];
export type ILocalizationPage = ILocalization["pages"];
export type ILocalizationEntities = ILocalization["entities"];

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

export const getDictionary = async (locale: keyof typeof dictionaries) => {
  return await dictionaries[locale]();
};

export async function getTranslation(locale: keyof typeof dictionaries) {}
