import i18next, { type InitOptions, type Resource } from "i18next";
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

i18next
  .use(resourcesToBackend(fetchTranslation))
  .use(initReactI18next)
  .on("failedLoading", (_language, _namespace, message) =>
    console.error(message),
  );

const options = {
  supportedLngs: LOCALES,
  load: "currentOnly",
  ns: DEFAULT_NAMESPACES,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: {
    // react already safes from xss =>
    // https://www.i18next.com/translation-function/interpolation#unescape
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  debug: IS_DEVELOPMENT,
  returnEmptyString: false,
  returnNull: false,
} satisfies InitOptions;

export async function getTranslation(language: ILocale): Promise<Resource> {
  if (!i18next.isInitialized) {
    await i18next.init()
  }

  const instance = i18next.createInstance({ ...options, lng: language });

  await instance.init();
  await instance.loadNamespaces(DEFAULT_NAMESPACES);

  console.log(`translation data:`);
  console.log(instance.store);

  return instance.store.data;
}

export function getInternatinalization() {
  return i18next;
}
