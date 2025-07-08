import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader, OverviewBody } from "@repo/ui/articles";
import { Heading } from "@repo/ui/headings";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { DateTimeView } from "@repo/ui/dates";
import { EntityID, parseName, parseTitle } from "@repo/ui/entities";
import { Preformatted } from "@repo/ui/formatting";
import { ButtonCopy } from "@repo/ui/buttons";
import type { ICommonTranslationPageProps } from "#lib/internationalization";
import { createMetaTitle } from "#lib/router";
import { getTranslation } from "#server/localization";
import { runTransaction } from "#database";
import {
  selectInvitationEntities,
  type IInvitationDB,
} from "#database/queries/invitations";
import { authenticateAdmin, getLanguage } from "#server/lib/router";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/overview";

import styles from "./overview.module.scss";

interface IProps extends ICommonTranslationPageProps<"invitation"> {
  invitation: IInvitationDB;
}

export function meta({ data }: Route.MetaArgs) {
  const { translation, invitation } = data;
  const parsedTitle = parseTitle(invitation.title, invitation.id);
  const title = createMetaTitle(
    `${translation["Invitation"]} ${parsedTitle} ${translation["overview"]}`,
  );

  return [{ title }];
}

function InvitationOverviewPage({ loaderData }: Route.ComponentProps) {
  const { language, commonTranslation, translation, invitation } = loaderData;
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
  const parsedTitle = parseTitle(title);
  const heading = translation["Invitation Overview"];

  return (
    <Page heading={heading}>
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
                  dKey={translation["Code"]}
                  dValue={
                    <>
                      <Preformatted>{code}</Preformatted>
                      <ButtonCopy translation={commonTranslation} valueToCopy={code} />
                    </>
                  }
                />

                <DescriptionSection
                  dKey={translation["Target role"]}
                  dValue={target_role}
                  isValuePreformatted
                  isHorizontal
                />

                <DescriptionSection
                  dKey={translation["Status"]}
                  dValue={
                    is_active ? (
                      <span className={styles.active}>
                        {translation["Active"]}
                      </span>
                    ) : (
                      <span className={styles.inactive}>
                        {translation["Inactive"]}
                      </span>
                    )
                  }
                  isHorizontal
                />

                <DescriptionSection
                  dKey={translation["Creator"]}
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
                    dKey={translation["Description"]}
                    dValue={description}
                  />
                )}

                {expires_at && (
                  <DescriptionSection
                    dKey={translation["Expires at"]}
                    dValue={<DateTimeView translation={commonTranslation} dateTime={expires_at} />}
                  />
                )}

                {invitation.max_uses && (
                  <UsesStat
                    language={language}
                    translation={translation}
                    id={id}
                    max_uses={invitation.max_uses}
                    // biome-ignore lint/style/noNonNullAssertion: just correlated values things
                    current_uses={invitation.current_uses!}
                  />
                )}

                <DescriptionSection
                  dKey={translation["Created at"]}
                  dValue={<DateTimeView translation={commonTranslation} dateTime={created_at} />}
                />

                <DescriptionSection
                  dKey={translation["Latest updated at"]}
                  dValue={<DateTimeView translation={commonTranslation} dateTime={updated_at} />}
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
  extends Pick<IProps, "language" | "translation">,
    Pick<Required<IInvitationDB>, "id" | "max_uses" | "current_uses"> {}

function UsesStat({
  language,
  translation,
  id,
  max_uses,
  current_uses,
}: IUsesStatProps) {
  return (
    <DescriptionSection
      dKey={translation["Uses"]}
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
          {current_uses} {translation["out of"]} {max_uses}
        </LinkInternal>
      }
      isHorizontal
    />
  );
}

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const { id } = params;

  const language = getLanguage(params);
  const { pages, common: commonTranslation } = await getTranslation(language);
  const translation = pages["invitation"];

  const invitation = await runTransaction(async (transaction) => {
    const [invitation] = await selectInvitationEntities(transaction, [id]);

    return invitation;
  });

  const props: IProps = {
    language,
    commonTranslation,
    translation,
    invitation,
  };

  return props;
}

export default InvitationOverviewPage;
