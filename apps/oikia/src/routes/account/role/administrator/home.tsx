import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { authenticateRequest } from "#server/lib/router";
import { runTransaction } from "#database";
import { selectInvitationCount } from "#database/queries/invitations";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/home";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Administrator" }];
}

/**
 * @TODO client render
 */
function RegistrationPage({ loaderData }: Route.ComponentProps) {
  const { count } = loaderData;
  const heading = "Administrator";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <DescriptionList>
                <DescriptionSection
                  dKey={"Invitations"}
                  dValue={
                    <LinkInternal
                      href={href("/account/role/administrator/invitations")}
                    >
                      {count}
                    </LinkInternal>
                  }
                  isHorizontal
                />
              </DescriptionList>
            </OverviewHeader>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function loader({ request, context }: Route.LoaderArgs) {
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
