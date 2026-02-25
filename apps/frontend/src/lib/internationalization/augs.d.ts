import "i18next";
import type common from "#translation/en/common.json";
import type translation from "#translation/en/translation.json";
import type { IDefaultNameSpace } from "./types";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: IDefaultNameSpace;
    resources: {
      common: typeof common;
      translation: typeof translation;
    };
    enableSelector: "optimize";
  }
}
