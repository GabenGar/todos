import type { ResourceKey } from "i18next";
import { fetchTranslation as fetchReactRouterTranslation } from "@repo/react-router/translation/lib";
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
        case "@repo/ui": {
          translation = await fetchUITranslation(language);
          break;
        }

        case "@repo/react-router": {
          translation = await fetchReactRouterTranslation(language);
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
        case "@repo/ui": {
          translation = await fetchUITranslation(language);
          break;
        }

        case "@repo/react-router": {
          translation = await fetchReactRouterTranslation(language);
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
