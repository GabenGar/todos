import { href, redirect } from "react-router";
import {
  createServerAction,
  getLanguage,
  parseMethod,
} from "#server/lib/router";
import { destroySession, getSession } from "#server/lib/sessions";
import { getCommonTranslation } from "#server/localization";

import type { Route } from "./+types/logout";

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
  return loaderHeaders ? loaderHeaders : actionHeaders;
}

export const action = createServerAction(
  async ({ request, params }: Route.ActionArgs) => {
    const language = getLanguage(params);
    const commonTranslation = await getCommonTranslation(language);

    parseMethod(request, "POST", commonTranslation);

    const session = await getSession(request.headers.get("Cookie"));
    const redirectResponse = redirect(href("/"));

    redirectResponse.headers.set("Set-Cookie", await destroySession(session));

    return redirectResponse;
  },
);
