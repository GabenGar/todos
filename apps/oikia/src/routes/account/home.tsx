import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Heading } from "@repo/ui/headings";
import { authenticateRequest, createServerLoader } from "#server/lib/router";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/home";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Account" }];
}

/**
 * @TODO client render
 */
function AccountPage({ loaderData }: Route.ComponentProps) {
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
                <DescriptionSection
                  dKey="Role"
                  dValue={
                    role !== "administrator" ? (
                      role
                    ) : (
                      <LinkInternal href={href("/account/role/administrator")}>
                        {role}
                      </LinkInternal>
                    )
                  }
                  isHorizontal
                />

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
    const account = await authenticateRequest(request);

    return account;
  }
);

export default AccountPage;
