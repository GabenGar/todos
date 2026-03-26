import "i18next";
import type translation from "#translation/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      // required for type check to pass
      "@repo/ui": any;
      "@repo/react-router": typeof translation;
    };
    enableSelector: "optimize";
  }
}
