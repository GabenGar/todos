import type engJSON from "../../../localization/en.json";

export type ILocalization = typeof engJSON;
export type ILocalizationCommon = ILocalization["common"];
export type ILocalizationPage = ILocalization["pages"];
export type ILocalizationEntities = ILocalization["entities"];
