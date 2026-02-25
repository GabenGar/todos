import i18next, { type InitOptions, type i18n } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { IS_DEVELOPMENT } from "#environment";
import { fetchTranslation } from "./fetch-translation";
import {
  DEFAULT_LOCALE,
  DEFAULT_NAMESPACES,
  type ILocale,
  LOCALES,
} from "./types";

let isInitialized = false;

const options = {
  debug: IS_DEVELOPMENT,
  supportedLngs: LOCALES,
  returnEmptyString: false,
  returnNull: false,
  load: "currentOnly",
  ns: [],
  defaultNS: DEFAULT_NAMESPACES,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: {
    // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  // @ts-expect-error it's in the docs
  enableSelector: "optimize"
} satisfies InitOptions;

export async function getTranslation(language: ILocale): Promise<i18n> {
  if (!isInitialized) {
    i18next
      .use(resourcesToBackend(fetchTranslation))
      .use(initReactI18next)
      .on("failedLoading", (_language, _namespace, message) =>
        console.error(message),
      );

    await i18next.init(options);

    isInitialized = true;
  }

  await i18next.changeLanguage(language);

  return i18next;
}

export function getCurrentTranslation() {
  return i18next;
}
