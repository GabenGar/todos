import "i18next";
import type common from "#translation/en.json"
import type { IActionableNameSpace } from "./types";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: IActionableNameSpace;
    resources: {
      common: typeof common
      // required for typecheck to pass
      "@repo/ui": any;
      "@repo/react-router": any;
    };
    enableSelector: "optimize";
  }
}
