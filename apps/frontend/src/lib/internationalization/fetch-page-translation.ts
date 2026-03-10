import type { ResourceKey } from "i18next";
import type { ILocale, IPageNamespace } from "./types";

export async function fetchPageTranslation(
  language: ILocale,
  namespace: IPageNamespace,
) {
  let translation: ResourceKey;

  switch (language) {
    case "en": {
      switch (namespace) {
        case "page-home": {
          translation = await import("#translation/en/pages/home.json");
          break;
        }

        case "page-qr-code-reader": {
          translation = await import("#translation/en/pages/home.json");
          break;
        }

        case "page-places": {
          translation = await import("#translation/en/pages/places.json");
          break;
        }

        case "page-place": {
          translation = await import("#translation/en/pages/place.json");
          break;
        }

        case "page-place-edit": {
          translation = await import("#translation/en/pages/place-edit.json");
          break;
        }

        case "page-stats-places": {
          translation = await import("#translation/en/pages/stats-places.json");
          break;
        }

        case "page-stats-tasks": {
          translation = await import("#translation/en/pages/stats-tasks.json");
          break;
        }

        case "page-tasks": {
          translation = await import("#translation/en/pages/tasks.json");
          break;
        }

        case "page-task": {
          translation = await import("#translation/en/pages/task.json");
          break;
        }

        case "page-task-edit": {
          translation = await import("#translation/en/pages/task-edit.json");
          break;
        }

        default: {
          throw new Error(`Unknown namespace "${namespace satisfies never}"`);
        }
      }
      break;
    }

    case "ru": {
      switch (namespace) {
        case "page-home": {
          translation = await import("#translation/ru/pages/home.json");
          break;
        }

        case "page-qr-code-reader": {
          translation = await import("#translation/ru/pages/home.json");
          break;
        }

        case "page-places": {
          translation = await import("#translation/ru/pages/places.json");
          break;
        }

        case "page-place": {
          translation = await import("#translation/ru/pages/place.json");
          break;
        }

        case "page-place-edit": {
          translation = await import("#translation/ru/pages/place-edit.json");
          break;
        }

        case "page-stats-places": {
          translation = await import("#translation/ru/pages/stats-places.json");
          break;
        }

        case "page-stats-tasks": {
          translation = await import("#translation/ru/pages/stats-tasks.json");
          break;
        }

        case "page-tasks": {
          translation = await import("#translation/ru/pages/tasks.json");
          break;
        }

        case "page-task": {
          translation = await import("#translation/ru/pages/task.json");
          break;
        }

        case "page-task-edit": {
          translation = await import("#translation/ru/pages/task-edit.json");
          break;
        }

        default: {
          throw new Error(`Unknown namespace "${namespace satisfies never}"`);
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
