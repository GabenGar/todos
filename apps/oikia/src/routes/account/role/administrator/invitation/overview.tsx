import { href } from "react-router";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { ButtonCopy } from "@repo/ui/buttons";
import { DateTimeView } from "@repo/ui/dates";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { EntityID, parseName, parseTitle } from "@repo/ui/entities";
import { Preformatted } from "@repo/ui/formatting";
import { Heading } from "@repo/ui/headings";
import { Page } from "@repo/ui/pages";
import { LinkInternal } from "#components/link";
import { runTransaction } from "#database";
import {
  type IInvitationDB,
  selectInvitationEntities,
} from "#database/queries/invitations";
import { useTranslation } from "#hooks";
import type { ILocalizedProps } from "#lib/pages";
import { createMetaTitle } from "#lib/router";
import { authenticateAdmin, createLocalizedLoader } from "#server/lib/router";
//

import type { Route } from "./+types/overview";
import styles from "./overview.module.scss";

interface IProps extends ILocalizedProps {
  invitation: IInvitationDB;
}

function InvitationOverviewPage({ loaderData }: Route.ComponentProps) {
  const { language, invitation } = loaderData;
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
    target_role,
  } = invitation;
  const { t } = useTranslation();
  const parsedTitle = parseTitle(title);
  const heading = t((t) => t.pages.invitation["Invitation Overview"]);
  const pageTitle = createMetaTitle(
    `${t((t) => t.pages.invitation["Invitation"])} ${parsedTitle} ${t((t) => t.pages.invitation["overview"])}`,
  );

  return (
    <Page heading={heading} title={pageTitle}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Heading level={headingLevel}>{parsedTitle}</Heading>
              <EntityID entityID={id} />
            </OverviewHeader>

            <OverviewBody>
              <DescriptionList>
                <DescriptionSection
                  dKey={t((t) => t.pages.invitation["Code"])}
                  dValue={
                    <>
                      <Preformatted>{code}</Preformatted>
                      <ButtonCopy valueToCopy={code} />
                    </>
                  }
                />

                <DescriptionSection
                  dKey={t((t) => t.pages.invitation["Target role"])}
                  dValue={target_role}
                  isValuePreformatted
                  isHorizontal
                />

                <DescriptionSection
                  dKey={t((t) => t.pages.invitation["Status"])}
                  dValue={
                    is_active ? (
                      <span className={styles.active}>
                        {t((t) => t.pages.invitation["Active"])}
                      </span>
                    ) : (
                      <span className={styles.inactive}>
                        {t((t) => t.pages.invitation["Inactive"])}
                      </span>
                    )
                  }
                  isHorizontal
                />

                <DescriptionSection
                  dKey={t((t) => t.pages.invitation["Creator"])}
                  dValue={
                    !created_by ? undefined : (
                      <LinkInternal
                        href={href(
                          "/:language/account/role/administrator/account/:id",
                          {
                            language,
                            id: created_by.id,
                          },
                        )}
                      >
                        {parseName(created_by.name)} ({created_by.id})
                      </LinkInternal>
                    )
                  }
                  isHorizontal
                />

                {description && (
                  <DescriptionSection
                    dKey={t((t) => t.pages.invitation["Description"])}
                    dValue={description}
                  />
                )}

                {expires_at && (
                  <DescriptionSection
                    dKey={t((t) => t.pages.invitation["Expires at"])}
                    dValue={<DateTimeView dateTime={expires_at} />}
                  />
                )}

                {invitation.max_uses && (
                  <UsesStat
                    language={language}
                    id={id}
                    max_uses={invitation.max_uses}
                    // biome-ignore lint/style/noNonNullAssertion: just correlated values things
                    current_uses={invitation.current_uses!}
                  />
                )}

                <DescriptionSection
                  dKey={t((t) => t.pages.invitation["Created at"])}
                  dValue={<DateTimeView dateTime={created_at} />}
                />

                <DescriptionSection
                  dKey={t((t) => t.pages.invitation["Latest updated at"])}
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
  extends Pick<IProps, "language">,
    Pick<Required<IInvitationDB>, "id" | "max_uses" | "current_uses"> {}

function UsesStat({ language, id, max_uses, current_uses }: IUsesStatProps) {
  const { t } = useTranslation();

  return (
    <DescriptionSection
      dKey={t((t) => t.pages.invitation["Uses"])}
      dValue={
        <LinkInternal
          href={href(
            "/:language/account/role/administrator/invitation/:id/accounts",
            {
              language,
              id,
            },
          )}
        >
          {current_uses} {t((t) => t.pages.invitation["out of"])} {max_uses}
        </LinkInternal>
      }
      isHorizontal
    />
  );
}

export const loader = createLocalizedLoader<IProps, Route.LoaderArgs>(
  async ({ request, params }, localizedProps) => {
    await authenticateAdmin(request);

    const { id } = params;

    const invitation = await runTransaction(async (transaction) => {
      const [invitation] = await selectInvitationEntities(transaction, [id]);

      return invitation;
    });

    const props: IProps = {
      ...localizedProps,
      invitation,
    };

    return props;
  },
);

export default InvitationOverviewPage;
