import { href } from "react-router";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { Page } from "@repo/ui/pages";
import {
  createPagination,
  type IPaginatedCollection,
} from "@repo/ui/pagination";
import { PreviewList } from "@repo/ui/previews";
import { LinkButton, LinkInternal } from "#components/link";
import { runTransaction } from "#database";
import {
  type IInvitationDB,
  selectInvitationCount,
  selectInvitationEntities,
  selectInvitationIDs,
} from "#database/queries/invitations";
import { InvitationPreview } from "#entities/account";
import { useTranslation } from "#hooks";
import type { ILocalizedProps } from "#lib/pages";
import { createMetaTitle } from "#lib/router";
import { authenticateAdmin, createLocalizedLoader } from "#server/lib/router";
//

import type { Route } from "./+types/invitations-list";

interface IProps extends ILocalizedProps {
  invitations: IPaginatedCollection<IInvitationDB>;
}

/**
 * @TODO client render
 */
function InvitationsListPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language, invitations } = loaderData;
  const heading = t((t) => t.pages.invitations["Invitations"]);
  const title = createMetaTitle(
    `${t((t) => t.pages.invitations["Invitations page"])} ${invitations.pagination.current_page} ${t((t) => t.pages.invitations["out of"])} ${invitations.pagination.total_pages}`,
  );

  return (
    <Page heading={heading} title={title}>
      <PreviewList
        LinkButtonComponent={LinkButton}
        noItemsElement={t((t) => t.pages.invitations["No invitations found."])}
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
                {t((t) => t.pages.invitations["Create invitation"])}
              </LinkInternal>
            </OverviewHeader>
          </>
        )}
      </Overview>
    </Page>
  );
}

export const loader = createLocalizedLoader(async function loader(
  { request, params }: Route.LoaderArgs,
  localizedProps,
) {
  await authenticateAdmin(request);

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
    ...localizedProps,
    invitations,
  };

  return props;
});

export default InvitationsListPage;
