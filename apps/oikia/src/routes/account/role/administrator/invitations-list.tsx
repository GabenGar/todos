import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { createPagination } from "@repo/ui/pagination";
import { authenticateRequest } from "#server/lib/router";
import { runTransaction } from "#database";
import {
  selectInvitationCount,
  selectInvitationEntities,
  selectInvitationIDs,
} from "#database/queries/invitations";

import type { Route } from "./+types/invitations-list";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Invitations" }];
}

/**
 * @TODO client render
 */
function InvitationsListPage({ loaderData }: Route.ComponentProps) {
  const { invitations } = loaderData;
  const heading = "Invitations";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>Null</OverviewHeader>

            {/* <OverviewBody></OverviewBody> */}
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateRequest(request, "administrator");

  const page = params.page;
  const invitations = await runTransaction(async (transaction) => {
    const count = await selectInvitationCount(transaction);

    const pagination = createPagination(count, page);
    const ids = await selectInvitationIDs(transaction, { pagination });
    const invitations = await selectInvitationEntities(transaction, ids);

    return invitations;
  });

  return { invitations };
}

export default InvitationsListPage;
