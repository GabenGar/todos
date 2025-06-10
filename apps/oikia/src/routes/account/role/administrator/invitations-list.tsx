import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { PreviewList } from "@repo/ui/previews";
import {
  createPagination,
  type IPaginatedCollection,
} from "@repo/ui/pagination";
import { authenticateAdmin } from "#server/lib/router";
import { runTransaction } from "#database";
import {
  selectInvitationCount,
  selectInvitationEntities,
  selectInvitationIDs,
  type IInvitationDB,
} from "#database/queries/invitations";
import { LinkButton } from "#components/link";
import { InvitationPreview } from "#entities/account";

import type { Route } from "./+types/invitations-list";

export function meta({ error, data }: Route.MetaArgs) {
  const { current_page, total_pages } = data.invitations.pagination;
  const title = `Invitations page ${current_page} out of ${total_pages}`;

  return [{ title }];
}

/**
 * @TODO client render
 */
function InvitationsListPage({ loaderData }: Route.ComponentProps) {
  const { invitations } = loaderData;
  const heading = "Invitations";

  return (
    <Page heading={heading}>
      <PreviewList
        LinkButtonComponent={LinkButton}
        noItemsElement={<>No invitations found.</>}
        pagination={invitations.pagination}
        buildURL={(page) =>
          href("/account/role/administrator/invitations/:page", { page })
        }
      >
        {invitations.items.map((invitation) => (
          <InvitationPreview
            key={invitation.id}
            headingLevel={2}
            invitation={invitation}
          />
        ))}
      </PreviewList>
    </Page>
  );
}

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const page = params.page;
  const invitations = await runTransaction(async (transaction) => {
    const count = await selectInvitationCount(transaction);

    const pagination = createPagination(count, page);
    const ids = await selectInvitationIDs(transaction, { pagination });
    const items = await selectInvitationEntities(transaction, ids);

    const invitations: IPaginatedCollection<IInvitationDB> = {
      pagination,
      items,
    };

    return invitations;
  });

  return { invitations };
}

export default InvitationsListPage;
