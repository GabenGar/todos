import "i18next";
import type translation from "#translation/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      "@repo/core": typeof translation;
    };
    enableSelector: "optimize";
  }
}
