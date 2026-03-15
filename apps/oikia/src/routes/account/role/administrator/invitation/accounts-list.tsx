import { href } from "react-router";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { parseTitle } from "@repo/ui/entities";
import { parsePositiveInteger } from "@repo/ui/numbers";
import { Page } from "@repo/ui/pages";
import {
  createPagination,
  type IPaginatedCollection,
} from "@repo/ui/pagination";
import { PreviewList } from "@repo/ui/previews";
import { LinkButton, LinkInternal } from "#components/link";
import { runReadOnlyTransaction } from "#database";
import {
  type IAccountDBPreview,
  selectAccountPreviews,
} from "#database/queries/accounts";
import {
  type IInvitationDB,
  selectInvitationEntities,
  selectInvitedAccountIDs,
} from "#database/queries/invitations";
import { AccountPreview } from "#entities/account";
import { useTranslation } from "#hooks";
import type { ILocalizedProps } from "#lib/pages";
import { createMetaTitle } from "#lib/router";
import { NotFoundError } from "#server/lib/errors";
import { authenticateAdmin, createLocalizedLoader } from "#server/lib/router";
//

import type { Route } from "./+types/accounts-list";

interface IProps extends ILocalizedProps {
  invitation: IInvitationDB;
  accounts: IPaginatedCollection<IAccountDBPreview>;
}

function InvitedAccountsListPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language, invitation, accounts } = loaderData;
  const parsedTitle = parseTitle(invitation.title, invitation.id);
  const invitationTitle = parseTitle(invitation.title, invitation.id);
  const heading = t((t) => t.pages["invited-accounts"]["Invited Accounts"]);
  const title = createMetaTitle(
    `${t((t) => t.pages["invited-accounts"]["Invited accounts for invitation"])} ${parsedTitle} ${t((t) => t.pages["invited-accounts"]["page"])} ${accounts.pagination.current_page} ${t((t) => t.pages["invited-accounts"]["out of"])} ${accounts.pagination.total_pages}`,
  );

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <OverviewHeader>
            <DescriptionList>
              <DescriptionSection
                dKey={t((t) => t.pages["invited-accounts"]["Invitation"])}
                dValue={
                  <LinkInternal
                    href={href(
                      "/:language/account/role/administrator/invitation/:id",
                      {
                        language,
                        id: invitation.id,
                      },
                    )}
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
        noItemsElement={t(
          (t) => t.pages["invited-accounts"]["No accounts found."],
        )}
        pagination={accounts.pagination}
        buildURL={(page) =>
          href(
            "/:language/account/role/administrator/invitation/:id/accounts/:page",
            {
              language,
              id: invitation.id,
              page,
            },
          )
        }
      >
        {accounts.items.map((account) => (
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

export const loader = createLocalizedLoader(async function loader(
  { request, params }: Route.LoaderArgs,
  localizedProps,
) {
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
      } satisfies IProps["accounts"],
    };

    return result;
  });

  const props: IProps = {
    ...localizedProps,
    invitation: result.invitation,
    accounts: result.accounts,
  };

  return props;
});

export default InvitedAccountsListPage;
