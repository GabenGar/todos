import { href, redirect } from "react-router";
import { parseTitle } from "@repo/ui/entities";
import { createPagination } from "@repo/ui/pagination";
import { BIGINT_ZERO } from "@repo/ui/numbers/bigint";
import { authenticateAdmin } from "#server/lib/router";
import { ClientError } from "#server/lib/errors";
import { runReadOnlyTransaction } from "#database";
import { selectInvitationEntities } from "#database/queries/invitations";

import type { Route } from "./+types/accounts";

export function meta({ data }: Route.MetaArgs) {
  const metaTitle = "Invited accounts";

  return [{ title: metaTitle }];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const { id } = params;

  const pagination = await runReadOnlyTransaction(async (transaction) => {
    const [invitation] = await selectInvitationEntities(transaction, [id]);

    const parsedCurrentUses = !invitation.current_uses
      ? undefined
      : BigInt(invitation.current_uses);

    if (!parsedCurrentUses || parsedCurrentUses === BIGINT_ZERO) {
      throw new ClientError("Not Found", { statusCode: 404 });
    }

    // biome-ignore lint/style/noNonNullAssertion: typescript losing context
    const pagination = createPagination(invitation.current_uses!);

    return pagination;
  });

  return redirect(
    href("/account/role/administrator/invitation/:id/accounts/:page", {
      id,
      page: pagination.current_page,
    }),
  );
}
