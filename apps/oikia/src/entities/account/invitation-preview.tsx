import { href } from "react-router";
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
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import type {
  IEntityTranslationProps,
  ILanguageProps,
} from "#lib/internationalization";
import type { IInvitationDB } from "#database/queries/invitations";
import { LinkInternal } from "#components/link";

import styles from "./invitation-preview.module.scss";

interface IProps
  extends ILanguageProps,
    IEntityTranslationProps<"invitation">,
    IPreviewProps {
  invitation: IInvitationDB;
}

export const InvitationPreview: ReturnType<
  typeof createBlockComponent<IProps>
> = createBlockComponent(undefined, Component);

function Component({
  language,
  entityTranslation,
  invitation,
  ...props
}: IProps) {
  const translation = entityTranslation.invitation;
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
                dKey={translation["Code"]}
                dValue={code}
                isValuePreformatted
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
                    <span className={styles.active}>{translation["Active"]}</span>
                  ) : (
                    <span className={styles.inactive}>{translation["Inactive"]}</span>
                  )
                }
                isHorizontal
              />

              <DescriptionSection
                dKey={translation["Description"]}
                dValue={
                  !description ? (
                    translation["No description provided"]
                  ) : (
                    <EntityDescription>{description}</EntityDescription>
                  )
                }
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
