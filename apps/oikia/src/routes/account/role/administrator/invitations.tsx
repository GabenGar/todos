import { href, redirect, replace } from "react-router";
import { createPagination } from "@repo/ui/pagination";
import { BIGINT_ZERO } from "@repo/ui/numbers/bigint";
import { authenticateRequest } from "#server/lib/router";
import { runTransaction } from "#database";
import { selectInvitationCount } from "#database/queries/invitations";

import type { Route } from "./+types/invitations";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Invitations" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await authenticateRequest(request, "administrator");

  const count = await runTransaction(async (transaction) => {
    const count = await selectInvitationCount(transaction);

    return count;
  });

  if (BigInt(count) === BIGINT_ZERO) {
    const url = href("/account/role/administrator/create/invitation");

    return redirect(url);
  }

  const pagination = createPagination(count);
  const url = href("/account/role/administrator/invitations/:page", {
    page: pagination.current_page,
  });

  return replace(url);
}
