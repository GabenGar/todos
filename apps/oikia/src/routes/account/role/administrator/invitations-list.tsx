import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { PreviewList } from "@repo/ui/previews";
import {
  createPagination,
  type IPaginatedCollection,
} from "@repo/ui/pagination";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import type {
  IEntityTranslationProps,
  ITranslationPageProps,
} from "#lib/internationalization";
import { createMetaTitle } from "#lib/router";
import { authenticateAdmin, getLanguage } from "#server/lib/router";
import { getTranslation } from "#server/localization";
import { runTransaction } from "#database";
import {
  selectInvitationCount,
  selectInvitationEntities,
  selectInvitationIDs,
  type IInvitationDB,
} from "#database/queries/invitations";
import { LinkButton, LinkInternal } from "#components/link";
import { InvitationPreview } from "#entities/account";

import type { Route } from "./+types/invitations-list";

interface IProps
  extends IEntityTranslationProps<"invitation">,
    ITranslationPageProps<"invitations"> {
  invitations: IPaginatedCollection<IInvitationDB>;
}

export function meta({ data }: Route.MetaArgs) {
  const { translation, invitations } = data;
  const { current_page, total_pages } = invitations.pagination;
  const title = createMetaTitle(
    `${translation["Invitations page"]} ${current_page} ${translation["out of"]} ${total_pages}`,
  );

  return [{ title }];
}

/**
 * @TODO client render
 */
function InvitationsListPage({ loaderData }: Route.ComponentProps) {
  const { language, translation, entityTranslation, invitations } = loaderData;
  const heading = translation["Invitations"];

  return (
    <Page heading={heading}>
      <PreviewList
        LinkButtonComponent={LinkButton}
        noItemsElement={translation["No invitations found."]}
        pagination={invitations.pagination}
        buildURL={(page) =>
          href("/:language/account/role/administrator/invitations/:page", {
            language,
            page,
          })
        }
      >
        {invitations.items.map((invitation) => (
          <InvitationPreview
            key={invitation.id}
            language={language}
            entityTranslation={entityTranslation}
            headingLevel={2}
            invitation={invitation}
          />
        ))}
      </PreviewList>

      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <LinkInternal
                href={href(
                  "/:language/account/role/administrator/create/invitation",
                  { language },
                )}
              >
                {translation["Create invitation"]}
              </LinkInternal>
            </OverviewHeader>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const language = getLanguage(params);
  const { pages, entities } = await getTranslation(language);
  const translation = pages["invitations"];
  const page = params.page;

  const invitations = await runTransaction(async (transaction) => {
    const count = await selectInvitationCount(transaction);

    const pagination = createPagination(count, page);
    const ids = await selectInvitationIDs(transaction, { pagination });
    const items = await selectInvitationEntities(transaction, ids);

    const invitations = {
      pagination,
      items,
    } satisfies IPaginatedCollection<IInvitationDB>;

    return invitations;
  });

  const props: IProps = {
    language,
    translation,
    entityTranslation: { invitation: entities.invitation },
    invitations,
  };

  return props;
}

export default InvitationsListPage;
