import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { createServerLoader } from "#server/lib/router";
import { getSession } from "#server/lib/sessions";

import type { Route } from "./+types/home";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Account" }];
}

/**
 * @TODO client render
 */
function RegistrationPage({ loaderData }: Route.ComponentProps) {
  const heading = "Account";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>acc</OverviewHeader>
            <OverviewBody>details</OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export const loader = createServerLoader(
  async ({ request }: Route.LoaderArgs) => {
    const session = await getSession(
      request.headers.get("Cookie")
    );

    const authID = session.get("auth_id")

    if (!authID) {
      throw new Error("Not Authorized.")
    }



    throw new Error("Not Implemented.");
  }
);

export default RegistrationPage;
