import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Heading } from "@repo/ui/headings";
import { createServerLoader } from "#server/lib/router";
import { getSession } from "#server/lib/sessions";
import { runTransaction } from "#database";
import {
  selectAccountAuth,
  selectAccountEntities,
} from "#database/queries/accounts";

import type { Route } from "./+types/home";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Account" }];
}

/**
 * @TODO client render
 */
function RegistrationPage({ loaderData }: Route.ComponentProps) {
  const heading = "Account";

  if (!loaderData.is_successful) {
    const {
      errors: [error],
    } = loaderData;

    throw new Error(`${error.name}: ${error.message}`);
  }

  const { name, role, created_at } = loaderData.data;

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Heading level={headingLevel + 1}>{name}</Heading>
            </OverviewHeader>

            <OverviewBody>
              <DescriptionList>
                <DescriptionSection dKey="Role" dValue={role} isHorizontal />

                <DescriptionSection dKey="Joined" dValue={created_at} />
              </DescriptionList>
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export const loader = createServerLoader(
  async ({ request }: Route.LoaderArgs) => {
    const session = await getSession(request.headers.get("Cookie"));
    const authID = session.get("auth_id");

    if (!authID) {
      throw new Error("Not Authorized.");
    }

    const account = await runTransaction(async (transaction) => {
      const { id } = await selectAccountAuth(transaction, {
        auth_id: authID,
      });
      const [{ id: _, ...account }] = await selectAccountEntities(transaction, [
        id,
      ]);

      return account;
    });

    return account;
  },
);

export default RegistrationPage;
