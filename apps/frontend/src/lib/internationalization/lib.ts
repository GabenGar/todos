import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import en from "#translation/en.json";
import { DEFAULT_LOCALE, type ILocale } from "./types";

i18next
  .use(
    resourcesToBackend<ILocale, "translation">(
      async (language, namespace) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .on("failedLoading", (lng, ns, msg) => console.error(msg))
  .init({
    fallbackLng: DEFAULT_LOCALE,
    debug: true,
    resources: {
      en: {
        translation: en,
      },
    },
  });
