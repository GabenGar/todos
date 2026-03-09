import "i18next";
import type common from "#translation/en/common.json";
import type pageHome from "#translation/en/pages/home.json";
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
    };
    enableSelector: "optimize";
  }
}
