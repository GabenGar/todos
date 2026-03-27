import type { ResourceKey } from "i18next";
import { fetchUITranslation } from "@repo/ui/internationalization";
import type { ILocale, INameSpace } from "./types";

export async function fetchTranslation(
  language: ILocale,
  namespace: INameSpace,
) {
  let translation: ResourceKey;

  switch (language) {
    case "en": {
      switch (namespace) {
        case "translation": {
          translation = await import("#translation/en.json");
          break;
        }

        case "@repo/ui": {
          translation = await fetchUITranslation(language);
          break;
        }

        default: {
          throw new Error(
            `Unknown translation namespace "${namespace satisfies never}"`,
          );
        }
      }
      break;
    }

    case "ru": {
      switch (namespace) {
        case "translation": {
          translation = await import("#translation/ru.json");
          break;
        }

        case "@repo/ui": {
          translation = await fetchUITranslation(language);
          break;
        }

        default: {
          throw new Error(
            `Unknown translation namespace "${namespace satisfies never}"`,
          );
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
