import { href, redirect } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader, OverviewBody } from "@repo/ui/articles";
import { Heading } from "@repo/ui/headings";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Preformatted } from "@repo/ui/formatting";
import { DateTimeView } from "@repo/ui/dates";
import { parseName, parseTitle } from "@repo/ui/entities";
import { runTransaction } from "#database";
import { selectAccountEntities } from "#database/queries/accounts";
import { authenticateAdmin } from "#server/lib/router";
import { ClientError } from "#server/lib/errors";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/account";

export function meta({ data }: Route.MetaArgs) {
  const { account } = data;
  const { id, name } = account;
  const parsedName = parseName(name, id);
  const metaTitle = `Account ${parsedName} overview`;

  return [{ title: metaTitle }];
}

function InvitationOverviewPage({ loaderData }: Route.ComponentProps) {
  const { account } = loaderData;
  const { id, role, name, created_at, invited_through } = account;
  const parsedName = parseName(name);
  const heading = "Account Overview";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Heading level={headingLevel}>{parsedName}</Heading>
              <Preformatted>{id}</Preformatted>
            </OverviewHeader>

            <OverviewBody>
              <DescriptionList>
                <DescriptionSection dKey={"Role"} dValue={role} isHorizontal />

                <DescriptionSection
                  dKey={"Join date"}
                  dValue={<DateTimeView dateTime={created_at} />}
                />

                {invited_through && (
                  <DescriptionSection
                    dKey={"Invited through"}
                    dValue={
                      <LinkInternal
                        href={href(
                          "/account/role/administrator/invitation/:id",
                          { id: invited_through.id },
                        )}
                      >
                        {parseTitle(invited_through.title, invited_through.id)}
                      </LinkInternal>
                    }
                  />
                )}
              </DescriptionList>
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    await authenticateAdmin(request);
  } catch (error) {
    const pathName =
      error instanceof ClientError && error.statusCode === 401
        ? "/401"
        : "/404";

    return redirect(pathName);
  }

  const { id } = params;

  const account = await runTransaction(async (transaction) => {
    const [account] = await selectAccountEntities(transaction, [id]);

    return account;
  });

  return { account };
}

export default InvitationOverviewPage;
