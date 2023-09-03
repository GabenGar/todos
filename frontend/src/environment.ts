export const NODE_ENV = process.env.NODE_ENV;

export const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE!;

if (!SITE_TITLE) {
  throw new Error(`"SITE_TITLE" is not set.`);
}

export const REPOSITORY_URL = process.env.NEXT_PUBLIC_REPOSITORY_URL!;

if (!REPOSITORY_URL) {
  throw new Error(`"REPOSITORY_URL" is not set.`);
}

export const IS_DEVELOPMENT = NODE_ENV === "development";
