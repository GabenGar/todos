import { data, redirect } from "react-router";
import { createServerAction } from "#server/lib/router";
import { destroySession, getSession } from "#server/lib/sessions";
import { createSuccessfullAPIResponse } from "#server/lib/api";

import type { Route } from "./+types/logout";

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
  return loaderHeaders ? loaderHeaders : actionHeaders;
}

export const action = createServerAction(
  async ({ request }: Route.ActionArgs) => {
    switch (request.method) {
      case "POST": {
        const session = await getSession(request.headers.get("Cookie"));

        const headers = new Headers([
          ["Set-Cookie", await destroySession(session)],
        ]);

        const response = data(createSuccessfullAPIResponse(true), {
          headers,
        });

        return response;
      }

      default: {
        throw new Error(`Unknown method "${request.method}".`);
      }
    }
  },
);
