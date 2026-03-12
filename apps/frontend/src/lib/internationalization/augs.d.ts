import "i18next";
import type ui from "@repo/ui/translation/en.json";
import type common from "#translation/en/common.json";
import type pageAccount from "#translation/en/pages/account.json";
import type pageHome from "#translation/en/pages/home.json";
import type pagePlace from "#translation/en/pages/place.json";
import type pagePlaceEdit from "#translation/en/pages/place-edit.json";
import type pagePlaces from "#translation/en/pages/places.json";
import type pagePlannedEvent from "#translation/en/pages/planned-event.json";
import type pagePlannedEventEdit from "#translation/en/pages/planned-event-edit.json";
import type pagePlannedEvents from "#translation/en/pages/planned-events.json";
import type pageQRReader from "#translation/en/pages/qr-code-reader.json";
import type pageStatsPlaces from "#translation/en/pages/stats-places.json";
import type pageStatsTasks from "#translation/en/pages/stats-tasks.json";
import type pageTask from "#translation/en/pages/task.json";
import type pageTaskEdit from "#translation/en/pages/task-edit.json";
import type pageTasks from "#translation/en/pages/tasks.json";
import type pageURL from "#translation/en/pages/url.json";
import type pageURLEdit from "#translation/en/pages/url-edit.json";
import type pageYTDLPConfigs from "#translation/en/pages/yt-dlp-configs.json";
import type translation from "#translation/en/translation.json";
import type { IActionableNameSpace } from "./types";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: IActionableNameSpace;
    resources: {
      "@repo/ui": typeof ui;
      common: typeof common;
      translation: typeof translation;
      "page-home": typeof pageHome;
      "page-qr-code-reader": typeof pageQRReader;
      "page-places": typeof pagePlaces;
      "page-place": typeof pagePlace;
      "page-place-edit": typeof pagePlaceEdit;
      "page-stats-tasks": typeof pageStatsTasks;
      "page-stats-places": typeof pageStatsPlaces;
      "page-tasks": typeof pageTasks;
      "page-task": typeof pageTask;
      "page-task-edit": typeof pageTaskEdit;
      "page-account": typeof pageAccount;
      "page-url": typeof pageURL;
      "page-url-edit": typeof pageURLEdit;
      "page-planned-events": typeof pagePlannedEvents;
      "page-planned-event": typeof pagePlannedEvent;
      "page-planned-event-edit": typeof pagePlannedEventEdit;
      "page-yt-dlp-configs": typeof pageYTDLPConfigs;
    };
    enableSelector: "optimize";
  }
}
