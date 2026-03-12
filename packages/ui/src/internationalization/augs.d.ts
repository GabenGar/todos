import "i18next";
import type translation from "#translation/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      "@repo/ui": typeof translation;
    };
    enableSelector: "optimize";
  }
}
