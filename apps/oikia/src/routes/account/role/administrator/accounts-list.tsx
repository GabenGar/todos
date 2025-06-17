import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { PreviewList } from "@repo/ui/previews";
import {
  createPagination,
  type IPaginatedCollection,
} from "@repo/ui/pagination";
import { authenticateAdmin } from "#server/lib/router";
import { runTransaction } from "#database";
import { LinkButton } from "#components/link";
import { AccountPreview } from "#entities/account";
import {
  selectAccountCount,
  selectAccountIDs,
  selectAccountPreviews,
  type IAccountDBPreview,
} from "#database/queries/accounts";

import type { Route } from "./+types/accounts-list";

export function meta({ data }: Route.MetaArgs) {
  const { current_page, total_pages } = data.accounts.pagination;
  const title = `Accounts page ${current_page} out of ${total_pages}`;

  return [{ title }];
}

/**
 * @TODO client render
 */
function InvitationsListPage({ loaderData }: Route.ComponentProps) {
  const { accounts } = loaderData;
  const { pagination, items } = accounts;
  const heading = "Accounts";

  return (
    <Page heading={heading}>
      <PreviewList
        LinkButtonComponent={LinkButton}
        noItemsElement={<>No accounts found.</>}
        pagination={pagination}
        buildURL={(page) =>
          href("/account/role/administrator/accounts/:page", { page })
        }
      >
        {items.map((account) => (
          <AccountPreview key={account.id} headingLevel={2} account={account} />
        ))}
      </PreviewList>
    </Page>
  );
}

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const page = params.page;
  const accounts = await runTransaction(async (transaction) => {
    const count = await selectAccountCount(transaction);

    const pagination = createPagination(count, page);
    const ids = await selectAccountIDs(transaction, { pagination });
    const items = await selectAccountPreviews(transaction, ids);

    const accounts: IPaginatedCollection<IAccountDBPreview> = {
      pagination,
      items,
    };

    return accounts;
  });

  return { accounts };
}

export default InvitationsListPage;
