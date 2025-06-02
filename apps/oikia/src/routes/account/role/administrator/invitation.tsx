import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader, OverviewBody } from "@repo/ui/articles";
import { Heading } from "@repo/ui/headings";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Preformatted } from "@repo/ui/formatting";
import { DateTimeView } from "@repo/ui/dates";
import { runTransaction } from "#database";
import {
  selectInvitationEntities,
  type IInvitationDB,
} from "#database/queries/invitations";
import { authenticateAdmin } from "#server/lib/router";
import { LinkInternal } from "#components/link";

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

                {created_by && (
                  <DescriptionSection
                    dKey={"Creator"}
                    dValue={
                      <LinkInternal
                        href={href("/account/role/administrator/account/:id", {
                          id: created_by.id,
                        })}
                      >
                        {created_by.name ? `"${created_by.name}"` : "Unnamed"} (
                        {created_by.id})
                      </LinkInternal>
                    }
                    isHorizontal
                  />
                )}

                {description && (
                  <DescriptionSection
                    dKey={"Description"}
                    dValue={description}
                  />
                )}

                {expires_at && (
                  <DescriptionSection
                    dKey={"Expires at"}
                    dValue={<DateTimeView dateTime={expires_at} />}
                  />
                )}

                {invitation.max_uses && (
                  <UsesStat
                    max_uses={invitation.max_uses}
                    // biome-ignore lint/style/noNonNullAssertion: just correlated values things
                    current_uses={invitation.current_uses!}
                  />
                )}

                <DescriptionSection
                  dKey={"Created at"}
                  dValue={<DateTimeView dateTime={created_at} />}
                />

                <DescriptionSection
                  dKey={"Latest updated at"}
                  dValue={<DateTimeView dateTime={updated_at} />}
                />
              </DescriptionList>
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

interface IUsesStatProps
  extends Pick<Required<IInvitationDB>, "max_uses" | "current_uses"> {}

function UsesStat({ max_uses, current_uses }: IUsesStatProps) {
  return (
    <DescriptionSection
      dKey={"Uses"}
      dValue={
        <>
          {current_uses} out of {max_uses}
        </>
      }
      isHorizontal
    />
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
