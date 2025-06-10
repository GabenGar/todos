import { Page } from "@repo/ui/pages";
import { parseTitle } from "@repo/ui/entities";
import { NotImplementedError } from "@repo/ui/errors";
import { authenticateAdmin } from "#server/lib/router";

import type { Route } from "./+types/accounts-list";

export function meta({ data }: Route.MetaArgs) {
  const metaTitle = "Invited accounts";

  return [{ title: metaTitle }];
}

function InvitedAccountsListPage({ loaderData }: Route.ComponentProps) {
  const heading = "Invited Accounts"

  return <Page heading={heading}>Null</Page>
}

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const { id, page } = params;

  throw new NotImplementedError()
}

export default InvitedAccountsListPage
