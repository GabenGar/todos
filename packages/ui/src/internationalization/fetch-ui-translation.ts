import type { ResourceKey } from "i18next";
import type { ILocale } from "./types";

export async function fetchUITranslation(
  language: ILocale
) {
  let translation: ResourceKey;

  switch (language) {
    case "en": {
      translation = await import("#translation/en.json")
      break
    }

    case "ru": {
      translation = await import("#translation/ru.json")
      break
    }

    default: {
      throw new Error(`Unknown language "${language satisfies never}".`);
    }
  }

  return translation;
}
