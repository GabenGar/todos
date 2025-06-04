// https://vite.dev/guide/env-and-mode#built-in-constants

/**
 * The [mode](https://vite.dev/guide/env-and-mode#modes) the app is running in.
 */
export const MODE = import.meta.env.MODE as "development" | "production";

/**
 * The base url the app is being served from.
 * This is determined by the [base config option](https://vite.dev/config/shared-options#base).
 */
export const BASE_URL = import.meta.env.BASE_URL;

/**
 * Whether the app is running in production
 * (running the dev server with `NODE_ENV='production'`
 * or running an app built with `NODE_ENV='production'`).
 */
export const PROD = import.meta.env.PROD;

/**
 * Whether the app is running in development
 * (always the opposite of `import.meta.env.PROD`).
 */
export const DEV = import.meta.env.DEV;

/**
 * Whether the app is running in the [server](https://vite.dev/guide/ssr#conditional-logic).
 */
export const SSR = import.meta.env.SSR;
