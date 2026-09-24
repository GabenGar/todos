import i18next, { type InitOptions, type Resource } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { IS_TRANSLATION_DEBUG_ENABLED } from "#environment";
import { fetchTranslation } from "./fetch-translation";
import {
  DEFAULT_LOCALE,
  DEFAULT_NAMESPACES,
  type ILocale,
  type IPageNamespace,
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
  debug: IS_TRANSLATION_DEBUG_ENABLED,
  returnEmptyString: false,
  returnNull: false,
} satisfies InitOptions;

export async function getTranslation(
  language: ILocale,
  pageNamespace: IPageNamespace,
): Promise<Resource> {
  await initServerTranslation();

  await i18next.changeLanguage(language);
  await i18next.loadNamespaces(DEFAULT_NAMESPACES);
  await i18next.loadNamespaces(pageNamespace);

  return i18next.store.data;
}

async function initServerTranslation() {
  if (!i18next.isInitialized) {
    await i18next.init({ ...options });
  }
}

export function initClientTranslation(locale: ILocale, translation: Resource) {
  if (!i18next.isInitialized) {
    i18next.init({
      ...options,
      initAsync: false,
      lng: locale,
      resources: translation,
    });

    return;
  }

  if (i18next.language !== locale) {
    for (const [namespace, resource] of Object.entries(translation[locale])) {
      i18next.addResourceBundle(locale, namespace, resource, false, true);
    }

    i18next.changeLanguage(locale);
  }
}
