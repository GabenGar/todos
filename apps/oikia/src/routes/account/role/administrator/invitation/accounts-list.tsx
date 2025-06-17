import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { parseTitle } from "@repo/ui/entities";
import { parsePositiveInteger } from "@repo/ui/numbers";
import {
  createPagination,
  type IPaginatedCollection,
} from "@repo/ui/pagination";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { PreviewList } from "@repo/ui/previews";
import { authenticateAdmin } from "#server/lib/router";
import { NotFoundError } from "#server/lib/errors";
import { runReadOnlyTransaction } from "#database";
import {
  selectInvitationEntities,
  selectInvitedAccountIDs,
} from "#database/queries/invitations";
import {
  selectAccountPreviews,
  type IAccountDBPreview,
} from "#database/queries/accounts";
import { LinkButton, LinkInternal } from "#components/link";
import { AccountPreview } from "#entities/account";

import type { Route } from "./+types/accounts-list";

export function meta({ data }: Route.MetaArgs) {
  const { invitation, accounts } = data;
  const { current_page, total_pages } = accounts.pagination;
  const parsedTitle = parseTitle(invitation.title, invitation.id);
  const metaTitle = `Invited accounts for invitation ${parsedTitle} page ${current_page} out of ${total_pages}`;

  return [{ title: metaTitle }];
}

function InvitedAccountsListPage({ loaderData }: Route.ComponentProps) {
  const { invitation, accounts } = loaderData;
  const invitationTitle = parseTitle(invitation.title, invitation.id);
  const heading = "Invited Accounts";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <OverviewHeader>
            <DescriptionList>
              <DescriptionSection
                dKey={"Invitation"}
                dValue={
                  <LinkInternal
                    href={href("/account/role/administrator/invitation/:id", {
                      id: invitation.id,
                    })}
                  >
                    {invitationTitle}
                  </LinkInternal>
                }
              />
            </DescriptionList>
          </OverviewHeader>
        )}
      </Overview>

      <PreviewList
        LinkButtonComponent={LinkButton}
        noItemsElement={<>No accounts found.</>}
        pagination={accounts.pagination}
        buildURL={(page) =>
          href("/account/role/administrator/invitation/:id/accounts/:page", {
            id: invitation.id,
            page,
          })
        }
      >
        {accounts.items.map((account) => (
          <AccountPreview key={account.id} headingLevel={2} account={account} />
        ))}
      </PreviewList>
    </Page>
  );
}

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const { id, page } = params;

  parsePositiveInteger(params.id);
  parsePositiveInteger(params.page);

  const result = await runReadOnlyTransaction(async (transaction) => {
    const [invitation] = await selectInvitationEntities(transaction, [id]);

    if (!invitation.current_uses) {
      throw new NotFoundError();
    }

    const pagination = createPagination(invitation.current_uses, page);
    const ids = await selectInvitedAccountIDs(transaction, {
      invitation_id: id,
      pagination,
    });
    const items = await selectAccountPreviews(transaction, ids);

    const result = {
      invitation,
      accounts: {
        pagination,
        items,
      } satisfies IPaginatedCollection<IAccountDBPreview>,
    };

    return result;
  });

  const props = {
    invitation: result.invitation,
    accounts: result.accounts,
  };

  return props;
}

export default InvitedAccountsListPage;
