import { href, redirect } from "react-router";
import { createPagination } from "@repo/ui/pagination";
import { BIGINT_ZERO } from "@repo/ui/numbers/bigint";
import { authenticateAdmin, getLanguage } from "#server/lib/router";
import { NotFoundError } from "#server/lib/errors";
import { runReadOnlyTransaction } from "#database";
import { selectInvitationEntities } from "#database/queries/invitations";

import type { Route } from "./+types/accounts";

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const language = getLanguage(params);

  const { id } = params;

  const pagination = await runReadOnlyTransaction(async (transaction) => {
    const [invitation] = await selectInvitationEntities(transaction, [id]);

    const parsedCurrentUses = !invitation.current_uses
      ? undefined
      : BigInt(invitation.current_uses);

    if (!parsedCurrentUses || parsedCurrentUses === BIGINT_ZERO) {
      throw new NotFoundError();
    }

    // biome-ignore lint/style/noNonNullAssertion: typescript losing context
    const pagination = createPagination(invitation.current_uses!);

    return pagination;
  });

  return redirect(
    href(
      "/:language/account/role/administrator/invitation/:id/accounts/:page",
      {
        language,
        id,
        page: pagination.current_page,
      },
    ),
  );
}
