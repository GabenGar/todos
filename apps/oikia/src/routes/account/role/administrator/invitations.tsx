import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { authenticateRequest } from "#server/lib/router";
import { runTransaction } from "#database";
import { selectInvitationCount } from "#database/queries/invitations";

import type { Route } from "./+types/invitations";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Invitations" }];
}

/**
 * @TODO client render
 */
function RegistrationPage({ loaderData }: Route.ComponentProps) {
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
                  dValue={loaderData.count}
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

  return {
    count,
  };
}

export default RegistrationPage;
