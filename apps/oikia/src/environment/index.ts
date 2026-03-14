import { DEV } from "./vite";

export const IS_DEVELOPMENT = DEV;

const isTranslationDebugEnabled = import.meta.env
  .VITE_IS_TRANSLATION_DEBUG_ENABLED;
export const IS_TRANSLATION_DEBUG_ENABLED = !isTranslationDebugEnabled
  ? false
  : (JSON.parse(isTranslationDebugEnabled) as boolean);

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
