import i18next, { type InitOptions } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { getCurrentLocale } from "#lib/localization";
import { fetchTranslation } from "./fetch-translation";
import { DEFAULT_NAMESPACES, SUPPORTED_LANGUAGES } from "./types";

const options = {
  supportedLngs: SUPPORTED_LANGUAGES,
  load: "currentOnly",
  ns: DEFAULT_NAMESPACES,
  fallbackLng: getCurrentLocale(),
  interpolation: {
    // react already safes from xss =>
    // https://www.i18next.com/translation-function/interpolation#unescape
    escapeValue: false,
  },
  debug: false,
  returnEmptyString: false,
  returnNull: false,
} satisfies InitOptions;

i18next
  .use(resourcesToBackend(fetchTranslation))
  .use(initReactI18next)
  .on("failedLoading", (_language, _namespace, message) =>
    console.error(message),
  )
  .init(options);

export const i18n = i18next;
