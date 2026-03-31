// @TODO configurable values

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const SITE_TITLE = "GBGR Blog";
export const SOURCE_CODE_URL = "https://github.com/87906913/682222098";
export const SUPPORTED_LANGUAGES = ["en", "ru"] as const;
export const DEFAULT_LANGUAGE = "en";
export const IS_TRANSLATION_DEBUG_ENABLED = false;

// not invoking `window` directly because there is no `window` in service worker
// https://stackoverflow.com/a/8785422
export const IS_BROWSER =
  // @ts-ignore-error typescript types for worker do not like `windows` access for checking
  typeof globalThis["window"] !== "undefined" ||
  // https://stackoverflow.com/a/8785422
  // @ts-ignore-error typescript types for worker do not like `document` access for checking
  (typeof globalThis["document"] === "undefined" &&
    // @ts-ignore-error typescript types for worker do not like `document` access for checking
    typeof globalThis["importScripts"] !== "undefined");
