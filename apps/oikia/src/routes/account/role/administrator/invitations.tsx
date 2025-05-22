import { href, redirect } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { createPagination } from "@repo/ui/pagination";
import { BIGINT_ZERO } from "@repo/ui/numbers/bigint";
import { authenticateRequest } from "#server/lib/router";
import { runTransaction } from "#database";
import { selectInvitationCount } from "#database/queries/invitations";

import type { Route } from "./+types/invitations";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Invitations" }];
}

/**
 * @TODOs
 * - client render
 * - creation form
 */
function InvitationsPage({ loaderData }: Route.ComponentProps) {
  const { count } = loaderData;
  const heading = "Invitations";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <DescriptionList>
                <DescriptionSection
                  dKey={"Total"}
                  dValue={count}
                  isHorizontal
                />
              </DescriptionList>
            </OverviewHeader>

            {/* <OverviewBody></OverviewBody> */}
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  await authenticateRequest(request, "administrator");

  const count = await runTransaction(async (transaction) => {
    const count = await selectInvitationCount(transaction);

    return count;
  });

  if (BigInt(count) === BIGINT_ZERO) {
    return { count };
  }

  const pagination = createPagination(count);
  const url = href("/account/role/administrator/invitations/:page", {
    page: pagination.current_page,
  });

  return redirect(url);
}

export default InvitationsPage;
