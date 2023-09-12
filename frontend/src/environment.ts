export const NODE_ENV = process.env.NODE_ENV;

export const SITE_ORIGIN = process.env.NEXT_PUBLIC_ORIGIN!;

if (!SITE_ORIGIN) {
  throw new Error(`"NEXT_PUBLIC_ORIGIN" is not set.`);
}

export const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE!;

if (!SITE_TITLE) {
  throw new Error(`"NEXT_PUBLIC_SITE_TITLE" is not set.`);
}

export const REPOSITORY_URL = process.env.NEXT_PUBLIC_REPOSITORY_URL!;

if (!REPOSITORY_URL) {
  throw new Error(`"NEXT_PUBLIC_REPOSITORY_URL" is not set.`);
}

export const DEFAULT_LOG_LEVEL = process.env.NEXT_PUBLIC_DEFAULT_LOG_LEVEL;

export const IS_BROWSER = typeof window !== "undefined";
export const IS_DEVELOPMENT = NODE_ENV === "development";
