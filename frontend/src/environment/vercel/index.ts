/**
 * @TODO validation
 */

/**
 * An indicator to show that System Environment Variables
 * have been exposed to your project's Deployments.
 * @example 1
 */
export const VERCEL =
  process.env.VERCEL && process.env.VERCEL !== "" && Number(process.env.VERCEL);

export const VERCEL_ENV = process.env.VERCEL_ENV;
export const VERCEL_URL = process.env.VERCEL_URL;

/**
 * The Environment that the app is deployed and running on.
 * The value can be either `production`, `preview`, or `development`.
 */
export const NEXT_PUBLIC_VERCEL_ENV = getVercelEnvironmentVariable(
  process.env.NEXT_PUBLIC_VERCEL_ENV,
);

/**
 * The domain name of the generated deployment URL.
 * The value does not include the protocol scheme `https://`.
 * @example '*.vercel.app'
 */
export const NEXT_PUBLIC_VERCEL_URL = (() => {
  const url = getVercelEnvironmentVariable(process.env.NEXT_PUBLIC_VERCEL_URL);

  return `https://${url}`;
})();

function getVercelEnvironmentVariable(envVar: string | undefined) {
  return typeof envVar === "undefined" || envVar === "" ? undefined : envVar;
}
