import type { ResourceKey } from "i18next";
import type { ILocale, INamespace } from "./types";

export async function fetchTranslation(
  language: ILocale,
  namespace: INamespace,
) {
  let translation: ResourceKey;

  // doing nested
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
          translation = await import("@repo/ui/translation/en.json");
          break;
        }

        default: {
          throw new Error(`Unknown namespace "${namespace}"`);
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
          translation = await import("@repo/ui/translation/ru.json");
          break;
        }

        default: {
          throw new Error(`Unknown namespace "${namespace}"`);
        }
      }
      break;
    }

    default: {
      throw new Error(`Unknown language "${language}".`);
    }
  }

  return translation;
}
