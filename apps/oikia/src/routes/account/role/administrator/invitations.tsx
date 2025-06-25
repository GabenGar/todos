import { href, redirect, replace } from "react-router";
import { createPagination } from "@repo/ui/pagination";
import { BIGINT_ZERO } from "@repo/ui/numbers/bigint";
import { authenticateAdmin, getLanguage } from "#server/lib/router";
import { runTransaction } from "#database";
import { selectInvitationCount } from "#database/queries/invitations";

import type { Route } from "./+types/invitations";

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const language = getLanguage(params);
  const count = await runTransaction(async (transaction) => {
    const count = await selectInvitationCount(transaction);

    return count;
  });

  if (BigInt(count) === BIGINT_ZERO) {
    const url = href(
      "/:language/account/role/administrator/create/invitation",
      { language },
    );

    return redirect(url);
  }

  const pagination = createPagination(count);
  const url = href("/:language/account/role/administrator/invitations/:page", {
    language,
    page: pagination.current_page,
  });

  return replace(url);
}
