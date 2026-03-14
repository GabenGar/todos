import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import {
  createPagination,
  type IPaginatedCollection,
} from "@repo/ui/pagination";
import { PreviewList } from "@repo/ui/previews";
import { LinkButton } from "#components/link";
import { runTransaction } from "#database";
import {
  type IAccountDBPreview,
  selectAccountCount,
  selectAccountIDs,
  selectAccountPreviews,
} from "#database/queries/accounts";
import { AccountPreview } from "#entities/account";
import { useTranslation } from "#hooks";
import type { ILocalizedProps } from "#lib/pages";
import { createMetaTitle } from "#lib/router";
import { authenticateAdmin, createLocalizedLoader } from "#server/lib/router";
//

import type { Route } from "./+types/accounts-list";

interface IProps extends ILocalizedProps {
  accounts: IPaginatedCollection<IAccountDBPreview>;
}

/**
 * @TODO client render
 */
function InvitationsListPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language, accounts } = loaderData;
  const { pagination, items } = accounts;
  const heading = t((t) => t.pages.accounts["Accounts"]);
  const title = createMetaTitle(
    `${t((t) => t.pages.accounts["Accounts page"])} ${accounts.pagination.current_page} ${t((t) => t.pages.accounts["out of"])} ${accounts.pagination.total_pages}`,
  );

  return (
    <Page heading={heading} title={title}>
      <PreviewList
        LinkButtonComponent={LinkButton}
        noItemsElement={t((t) => t.pages.accounts["No accounts found."])}
        pagination={pagination}
        buildURL={(page) =>
          href("/:language/account/role/administrator/accounts/:page", {
            language,
            page,
          })
        }
      >
        {items.map((account) => (
          <AccountPreview
            key={account.id}
            language={language}
            headingLevel={2}
            account={account}
          />
        ))}
      </PreviewList>
    </Page>
  );
}

export const loader = createLocalizedLoader<IProps, Route.LoaderArgs>(
  async ({ request, params }, localizedProps) => {
    await authenticateAdmin(request);

    const page = params.page;

    const accounts = await runTransaction(async (transaction) => {
      const count = await selectAccountCount(transaction);

      const pagination = createPagination(count, page);
      const ids = await selectAccountIDs(transaction, { pagination });
      const items = await selectAccountPreviews(transaction, ids);

      const accounts = {
        pagination,
        items,
      } satisfies IProps["accounts"];

      return accounts;
    });

    const props: IProps = {
      ...localizedProps,
      accounts,
    };

    return props;
  },
);

export default InvitationsListPage;
