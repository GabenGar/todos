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
import type {
  ICommonTranslationPageProps,
  IEntityTranslationProps,
} from "#lib/internationalization";
import { createMetaTitle } from "#lib/router";
import { authenticateAdmin, getLanguage } from "#server/lib/router";
import { NotFoundError } from "#server/lib/errors";
import { getTranslation } from "#server/localization";
import { runReadOnlyTransaction } from "#database";
import {
  selectInvitationEntities,
  selectInvitedAccountIDs,
  type IInvitationDB,
} from "#database/queries/invitations";
import {
  selectAccountPreviews,
  type IAccountDBPreview,
} from "#database/queries/accounts";
import { LinkButton, LinkInternal } from "#components/link";
import { AccountPreview } from "#entities/account";

import type { Route } from "./+types/accounts-list";

interface IProps
  extends IEntityTranslationProps<"account">,
    ICommonTranslationPageProps<"invited-accounts"> {
  invitation: IInvitationDB;
  accounts: IPaginatedCollection<IAccountDBPreview>;
}

export function meta({ data }: Route.MetaArgs) {
  // @ts-expect-error cannot fetch translaction
  const { translation, invitation, accounts } = data;
  const { current_page, total_pages } = accounts.pagination;
  const parsedTitle = parseTitle(invitation.title, invitation.id);
  const title = createMetaTitle(
    `${translation["Invited accounts for invitation"]} ${parsedTitle} ${translation["page"]} ${current_page} ${translation["out of"]} ${total_pages}`,
  );

  return [{ title }];
}

function InvitedAccountsListPage({ loaderData }: Route.ComponentProps) {
  const {
    language,
    commonTranslation,
    translation,
    entityTranslation,
    invitation,
    accounts,
  } = loaderData;
  const invitationTitle = parseTitle(invitation.title, invitation.id);
  const heading = translation["Invited Accounts"];

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <OverviewHeader>
            <DescriptionList>
              <DescriptionSection
                dKey={translation["Invitation"]}
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
        noItemsElement={translation["No accounts found."]}
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
            commonTranslation={commonTranslation}
            entityTranslation={entityTranslation}
            headingLevel={2}
            account={account}
          />
        ))}
      </PreviewList>
    </Page>
  );
}

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const { id, page } = params;

  const language = getLanguage(params);
  const {
    pages,
    entities,
    common: commonTranslation,
  } = await getTranslation(language);
  const translation = pages["invited-accounts"];

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
    language,
    commonTranslation,
    translation,
    entityTranslation: { account: entities.account },
    invitation: result.invitation,
    accounts: result.accounts,
  };

  return props;
}

export default InvitedAccountsListPage;
