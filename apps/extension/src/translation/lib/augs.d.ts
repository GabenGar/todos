import "i18next";
import type { IActionableNameSpace } from "./types";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: IActionableNameSpace;
    resources: {
      // required for typecheck to pass
      "@repo/ui": any;
    };
    enableSelector: "optimize";
  }
}
