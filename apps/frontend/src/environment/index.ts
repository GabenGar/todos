import type { ILogLevel } from "#lib/logs";
import { NEXT_PUBLIC_VERCEL_URL } from "./vercel";

export const NODE_ENV = process.env.NODE_ENV;

export const SITE_BASE_URL =
  NEXT_PUBLIC_VERCEL_URL ?? process.env.NEXT_PUBLIC_SITE_BASE_URL;

export const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE!;

if (!SITE_TITLE) {
  throw new Error(`"SITE_TITLE" is not set.`);
}

export const REPOSITORY_URL = process.env.NEXT_PUBLIC_REPOSITORY_URL!;

if (!REPOSITORY_URL) {
  throw new Error(`"REPOSITORY_URL" is not set.`);
}

/**
 * @TODO somehow validate this value without cyclic dependencies.
 */
export const DEFAULT_LOG_LEVEL = process.env
  .NEXT_PUBLIC_DEFAULT_LOG_LEVEL as ILogLevel;

const NEXT_PUBLIC_IS_SERVICE_WORKER_ENABLED =
  process.env.NEXT_PUBLIC_IS_SERVICE_WORKER_ENABLED ?? "false";

if (
  NEXT_PUBLIC_IS_SERVICE_WORKER_ENABLED.length == 0 ||
  (NEXT_PUBLIC_IS_SERVICE_WORKER_ENABLED !== "true" &&
    NEXT_PUBLIC_IS_SERVICE_WORKER_ENABLED !== "false")
) {
  throw new Error(
    `Invalid value for "NEXT_PUBLIC_IS_SERVICE_WORKER_ENABLED" configuration option.`,
  );
}

/**
 * An option to nuke service workers off client when needed.
 *
 * https://youtu.be/CPP9ew4Co0M?t=1058
 */
export const IS_SERVICE_WORKER_ENABLED = JSON.parse(
  NEXT_PUBLIC_IS_SERVICE_WORKER_ENABLED,
) as boolean;
export const IS_BROWSER = typeof window !== "undefined";
export const IS_DEVELOPMENT = NODE_ENV === "development";
export const ROCKET_SHIP = "8::::::::::::::::D~~~~";

const basePathname = !SITE_BASE_URL
  ? undefined
  : new URL(SITE_BASE_URL, "https://example.com").pathname;
export const SITE_BASE_PATHNAME =
  // defaulting to empty string instead of `undefined`
  // so it wouldn't be ass to interpolate into path strings
  !basePathname || basePathname === "/" ? "" : basePathname;
