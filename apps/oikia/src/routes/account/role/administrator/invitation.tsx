import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader, OverviewBody } from "@repo/ui/articles";
import { Heading } from "@repo/ui/headings";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Preformatted } from "@repo/ui/formatting";
import { runTransaction } from "#database";
import { selectInvitationEntities } from "#database/queries/invitations";
import { authenticateAdmin } from "#server/lib/router";

import type { Route } from "./+types/invitation";

import styles from "./invitation.module.scss";

export function meta({ data }: Route.MetaArgs) {
  const { invitation } = data;
  const { id, title } = invitation;
  const metaTitle = `Invitation ${title ? `"${title}"` : "Untitled"} (${id}) overview`;

  return [{ title: metaTitle }];
}

function InvitationOverviewPage({ loaderData }: Route.ComponentProps) {
  const { invitation } = loaderData;
  const {
    id,
    title,
    code,
    created_at,
    updated_at,
    is_active,
    created_by,
    description,
    expires_at,
    max_uses,
  } = invitation;
  const parsedTitle = title ? `"${title}"` : "Untitled";
  const heading = "Invitation Overview";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Heading level={headingLevel}>{parsedTitle}</Heading>
              <Preformatted>{id}</Preformatted>
            </OverviewHeader>

            <OverviewBody>
              <DescriptionList>
                <DescriptionSection
                  dKey={"Code"}
                  dValue={code}
                  isValuePreformatted
                  isHorizontal
                />

                <DescriptionSection
                  dKey={"Status"}
                  dValue={
                    is_active ? (
                      <span className={styles.active}>Active</span>
                    ) : (
                      <span className={styles.inactive}>Inactive</span>
                    )
                  }
                  isHorizontal
                />

                <DescriptionSection
                  dKey={"Creator"}
                  dValue={created_by}
                  isHorizontal
                />

                {description && (
                  <DescriptionSection
                    dKey={"Description"}
                    dValue={description}
                  />
                )}

                {expires_at && (
                  <DescriptionSection dKey={"Expires at"} dValue={expires_at} />
                )}

                {max_uses && (
                  <DescriptionSection
                    dKey={"Maximum uses"}
                    dValue={max_uses}
                    isHorizontal
                  />
                )}

                <DescriptionSection dKey={"Created at"} dValue={created_at} />

                <DescriptionSection dKey={"Latest updated at"} dValue={updated_at} />
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

  const invitation = await runTransaction(async (transaction) => {
    const [invitation] = await selectInvitationEntities(transaction, [id]);

    return invitation;
  });

  return { invitation };
}

export default InvitationOverviewPage;
