import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader, OverviewBody } from "@repo/ui/articles";
import { Heading } from "@repo/ui/headings";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Preformatted } from "@repo/ui/formatting";
import { DateTimeView } from "@repo/ui/dates";
import { runTransaction } from "#database";
import { selectAccountEntities } from "#database/queries/accounts";
import { authenticateAdmin } from "#server/lib/router";

import type { Route } from "./+types/account";

export function meta({ data }: Route.MetaArgs) {
  const { account } = data;
  const { id, name } = account;
  const metaTitle = `Account ${name ? `"${name}"` : "Unnamed"} (${id}) overview`;

  return [{ title: metaTitle }];
}

function InvitationOverviewPage({ loaderData }: Route.ComponentProps) {
  const { account } = loaderData;
  const { id, role, name, created_at } = account;
  const parsedName = name ? `"${name}"` : "Unnamed";
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
              </DescriptionList>
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const { id } = params;

  const account = await runTransaction(async (transaction) => {
    const [account] = await selectAccountEntities(transaction, [id]);

    return account;
  });

  return { account };
}

export default InvitationOverviewPage;
