import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { List, ListItem } from "@repo/ui/lists";
import { authenticateRequest, createServerLoader } from "#server/lib/router";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/home";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Administrator" }];
}

/**
 * @TODO client render
 */
function RegistrationPage({ loaderData }: Route.ComponentProps) {
  const heading = "Administrator";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <List>
                <ListItem>
                  <LinkInternal
                    href={href("/account/role/administrator/invitations")}
                  >
                    Invitations
                  </LinkInternal>
                </ListItem>
              </List>
            </OverviewHeader>
          </>
        )}
      </Overview>
    </Page>
  );
}

export const loader = createServerLoader(
  async ({ request }: Route.LoaderArgs) => {
    await authenticateRequest(request, "administrator");
  }
);

export default RegistrationPage;
