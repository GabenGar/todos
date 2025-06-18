import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { authenticateRequest } from "#server/lib/router";
import { runTransaction } from "#database";
import { selectInvitationCount } from "#database/queries/invitations";
import { selectAccountCount } from "#database/queries/accounts";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/home";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Administrator" }];
}

/**
 * @TODO client render
 */
function AdministratorPage({ loaderData }: Route.ComponentProps) {
  const { accounts, invitations } = loaderData;
  const heading = "Administrator";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <DescriptionList>
                <DescriptionSection
                  dKey={"Accounts"}
                  dValue={
                    <LinkInternal
                      href={href("/account/role/administrator/accounts")}
                    >
                      {accounts}
                    </LinkInternal>
                  }
                  isHorizontal
                />

                <DescriptionSection
                  dKey={"Invitations"}
                  dValue={
                    <LinkInternal
                      href={href("/account/role/administrator/invitations")}
                    >
                      {invitations}
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

export async function loader({ request }: Route.LoaderArgs) {
  await authenticateRequest(request, "administrator");

  const results = await runTransaction(async (transaction) => {
    const accountCount = await selectAccountCount(transaction);
    const invitationCount = await selectInvitationCount(transaction);
    const result = { accounts: accountCount, invitations: invitationCount };

    return result;
  });

  return results;
}

export default AdministratorPage;
