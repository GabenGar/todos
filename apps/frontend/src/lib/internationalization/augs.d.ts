import "i18next";
import type common from "#translation/en/common.json";
import type pageHome from "#translation/en/pages/home.json";
import type pagePlace from "#translation/en/pages/place.json";
import type pagePlaceEdit from "#translation/en/pages/place-edit.json";
import type pagePlaces from "#translation/en/pages/places.json";
import type pageQRReader from "#translation/en/pages/qr-code-reader.json";
import type translation from "#translation/en/translation.json";
import type { IActionableNameSpace } from "./types";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: IActionableNameSpace;
    resources: {
      common: typeof common;
      translation: typeof translation;
      "page-home": typeof pageHome;
      "page-qr-code-reader": typeof pageQRReader;
      "page-places": typeof pagePlaces;
      "page-place": typeof pagePlace;
      "page-place-edit": typeof pagePlaceEdit
    };
    enableSelector: "optimize";
  }
}
