import type common from "#translation/en/common.json";
import type translation from "#translation/en/translation.json";
import type { DEFAULT_NAMESPACES } from "./types";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: (typeof DEFAULT_NAMESPACES)[number];
    resources: {
      common: common;
      translation: translation;
    };
    enableSelector: "optimize";
  }
}
