import i18next, { type InitOptions, type Resource } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import browser from "webextension-polyfill";
import { fetchTranslation } from "./fetch-translation";
import { DEFAULT_NAMESPACES, type ILocale, SUPPORTED_LANGUAGES } from "./types";

i18next
  .use(resourcesToBackend(fetchTranslation))
  .use(initReactI18next)
  .on("failedLoading", (_language, _namespace, message) =>
    console.error(message),
  );

const options = {
  supportedLngs: SUPPORTED_LANGUAGES,
  load: "currentOnly",
  ns: DEFAULT_NAMESPACES,
  fallbackLng: browser.runtime.getManifest().default_locale,
  interpolation: {
    // react already safes from xss =>
    // https://www.i18next.com/translation-function/interpolation#unescape
    escapeValue: false,
  },
  debug: false,
  returnEmptyString: false,
  returnNull: false,
} satisfies InitOptions;

export async function getTranslation(language: ILocale): Promise<Resource> {
  if (!i18next.isInitialized) {
    i18next.init(options);
  }

  await i18next.changeLanguage(language);
  await i18next.loadNamespaces(DEFAULT_NAMESPACES);

  return i18next.store.data;
}

export function isSupportedLanguage(input?: unknown): input is ILocale {
  return !input ? false : SUPPORTED_LANGUAGES.includes(input as ILocale);
}
