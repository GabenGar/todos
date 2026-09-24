import type { GetStaticPathsResult } from "next";
import type { ILocalizedParams } from "#lib/pages";
import { LOCALES } from "#translation";

/**
 * Generates locale path params for the route.
 */
export async function getStaticExportPaths(): Promise<
  GetStaticPathsResult<ILocalizedParams>
> {
  const paths = LOCALES.map((locale) => {
    return { params: { lang: locale } };
  }) satisfies GetStaticPathsResult<ILocalizedParams>["paths"];

  const result = {
    paths,
    fallback: false,
  } satisfies GetStaticPathsResult<ILocalizedParams>;

  return result;
}
