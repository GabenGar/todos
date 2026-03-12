import type { ResourceKey } from "i18next";
import { fetchUITranslation } from "@repo/ui/internationalization";
import { fetchPageTranslation } from "./fetch-page-translation";
import type { ILocale, INameSpace } from "./types";

export async function fetchTranslation(
  language: ILocale,
  namespace: INameSpace,
) {
  let translation: ResourceKey;

  switch (language) {
    case "en": {
      switch (namespace) {
        case "common": {
          translation = await import("#translation/en/common.json");
          break;
        }

        case "translation": {
          translation = await import("#translation/en/translation.json");
          break;
        }

        case "@repo/ui": {
          translation = await fetchUITranslation(language);
          break;
        }

        default: {
          translation = await fetchPageTranslation(language, namespace);
        }
      }
      break;
    }

    case "ru": {
      switch (namespace) {
        case "common": {
          translation = await import("#translation/ru/common.json");
          break;
        }

        case "translation": {
          translation = await import("#translation/ru/translation.json");
          break;
        }

        case "@repo/ui": {
          translation = await fetchUITranslation(language);
          break;
        }

        default: {
          translation = await fetchPageTranslation(language, namespace);
        }
      }
      break;
    }

    default: {
      throw new Error(`Unknown language "${language satisfies never}".`);
    }
  }

  return translation;
}
