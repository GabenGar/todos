import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { PreviewList } from "@repo/ui/previews";
import {
  createPagination,
  type IPaginatedCollection,
} from "@repo/ui/pagination";
import type {
  ICommonTranslationPageProps,
  IEntityTranslationProps,
} from "#lib/internationalization";
import { createMetaTitle } from "#lib/router";
import { getTranslation } from "#server/localization";
import { authenticateAdmin, getLanguage } from "#server/lib/router";
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

interface IProps
  extends IEntityTranslationProps<"account">,
    ICommonTranslationPageProps<"accounts"> {
  accounts: IPaginatedCollection<IAccountDBPreview>;
}

export function meta({ data }: Route.MetaArgs) {
  const { translation, accounts } = data;
  const { current_page, total_pages } = accounts.pagination;
  const title = createMetaTitle(
    `${translation["Accounts page"]} ${current_page} ${translation["out of"]} ${total_pages}`,
  );

  return [{ title }];
}

/**
 * @TODO client render
 */
function InvitationsListPage({ loaderData }: Route.ComponentProps) {
  const { language, commonTranslation, translation, entityTranslation, accounts } = loaderData;
  const { pagination, items } = accounts;
  const heading = translation["Accounts"];

  return (
    <Page heading={heading}>
      <PreviewList
        LinkButtonComponent={LinkButton}
        noItemsElement={translation["No accounts found."]}
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

  const language = getLanguage(params);
  const { pages, entities, common: commonTranslation } = await getTranslation(language);
  const translation = pages["accounts"];
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
    language,
    commonTranslation,
    translation,
    entityTranslation: { account: entities.account },
    accounts,
  };

  return props;
}

export default InvitationsListPage;
