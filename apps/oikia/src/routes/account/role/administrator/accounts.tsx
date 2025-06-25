import { href, replace } from "react-router";
import { createPagination } from "@repo/ui/pagination";
import { BIGINT_ZERO } from "@repo/ui/numbers/bigint";
import { authenticateAdmin, getLanguage } from "#server/lib/router";
import { NotFoundError } from "#server/lib/errors";
import { runTransaction } from "#database";
import { selectAccountCount } from "#database/queries/accounts";

import type { Route } from "./+types/accounts";

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const language = getLanguage(params);

  const count = await runTransaction(async (transaction) => {
    const count = await selectAccountCount(transaction);

    return count;
  });

  // accounts are not creatable by the admin
  if (BigInt(count) === BIGINT_ZERO) {
    throw new NotFoundError();
  }

  const pagination = createPagination(count);
  const url = href("/:language/account/role/administrator/accounts/:page", {
    language,
    page: pagination.current_page,
  });

  return replace(url);
}
