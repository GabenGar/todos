import { href, replace } from "react-router";
import { createPagination } from "@repo/ui/pagination";
import { BIGINT_ZERO } from "@repo/ui/numbers/bigint";
import { authenticateAdmin } from "#server/lib/router";
import { NotFoundError } from "#server/lib/errors";
import { runTransaction } from "#database";
import { selectAccountCount } from "#database/queries/accounts";

import type { Route } from "./+types/accounts";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Accounts" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const count = await runTransaction(async (transaction) => {
    const count = await selectAccountCount(transaction);

    return count;
  });

  // accounts are not creatable by the admin
  if (BigInt(count) === BIGINT_ZERO) {
    throw new NotFoundError();
  }

  const pagination = createPagination(count);
  const url = href("/account/role/administrator/accounts/:page", {
    page: pagination.current_page,
  });

  return replace(url);
}
