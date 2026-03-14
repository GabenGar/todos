import "i18next";
import type translation from "#translation/en.json";
import type { IActionableNameSpace } from "./types";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: IActionableNameSpace;
    resources: {
      // "@repo/ui": any;
      translation: typeof translation;
    };
    enableSelector: "optimize";
  }
}
