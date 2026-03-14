import { href } from "react-router";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import {
  EntityDescription,
  EntityID,
  parseName,
  parseTitle,
} from "@repo/ui/entities";
import { Heading } from "@repo/ui/headings";
import { createBlockComponent } from "@repo/ui/meta";
import {
  type IPreviewProps,
  Preview,
  PreviewBody,
  PreviewHeader,
} from "@repo/ui/previews";
import { LinkInternal } from "#components/link";
import type { IInvitationDB } from "#database/queries/invitations";
import { useTranslation } from "#hooks";
import type { ILanguageProps } from "#lib/internationalization";
//

import styles from "./invitation-preview.module.scss";

interface IProps extends ILanguageProps, IPreviewProps {
  invitation: IInvitationDB;
}

export const InvitationPreview: ReturnType<
  typeof createBlockComponent<IProps>
> = createBlockComponent(undefined, Component);

function Component({ language, invitation, ...props }: IProps) {
  const { t } = useTranslation();
  const { id, title, description, code, is_active, target_role, created_by } =
    invitation;
  const parsedTitle = parseTitle(title);
  const parsedName = parseName(created_by?.name);

  return (
    <Preview {...props}>
      {(headingLevel) => (
        <>
          <PreviewHeader>
            <Heading level={headingLevel}>
              <LinkInternal
                href={href(
                  "/:language/account/role/administrator/invitation/:id",
                  {
                    language,
                    id,
                  },
                )}
              >
                {parsedTitle}
              </LinkInternal>
            </Heading>

            <EntityID entityID={id} />
          </PreviewHeader>

          <PreviewBody>
            <DescriptionList>
              <DescriptionSection
                dKey={t((t) => t.entities.invitation["Code"])}
                dValue={code}
                isValuePreformatted
              />

              <DescriptionSection
                dKey={t((t) => t.entities.invitation["Target role"])}
                dValue={target_role}
                isValuePreformatted
                isHorizontal
              />

              <DescriptionSection
                dKey={t((t) => t.entities.invitation["Status"])}
                dValue={
                  is_active ? (
                    <span className={styles.active}>
                      {t((t) => t.entities.invitation["Active"])}
                    </span>
                  ) : (
                    <span className={styles.inactive}>
                      {t((t) => t.entities.invitation["Inactive"])}
                    </span>
                  )
                }
                isHorizontal
              />

              <DescriptionSection
                dKey={t((t) => t.entities.invitation["Description"])}
                dValue={
                  !description ? (
                    t((t) => t.entities.invitation["No description provided"])
                  ) : (
                    <EntityDescription>{description}</EntityDescription>
                  )
                }
              />

              <DescriptionSection
                dKey={t((t) => t.entities.invitation["Creator"])}
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
                      {parsedName} ({created_by.id})
                    </LinkInternal>
                  )
                }
                isHorizontal
              />
            </DescriptionList>
          </PreviewBody>
        </>
      )}
    </Preview>
  );
}
