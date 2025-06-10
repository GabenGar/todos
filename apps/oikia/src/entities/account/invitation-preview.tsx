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
import type { IInvitationDB } from "#database/queries/invitations";
import { LinkInternal } from "#components/link";

import styles from "./invitation-preview.module.scss";

interface IProps extends IPreviewProps {
  invitation: IInvitationDB;
}

export const InvitationPreview: ReturnType<
  typeof createBlockComponent<IProps>
> = createBlockComponent(undefined, Component);

function Component({ invitation, ...props }: IProps) {
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
                href={href("/account/role/administrator/invitation/:id", {
                  id,
                })}
              >
                {parsedTitle}
              </LinkInternal>
            </Heading>

            <EntityID entityID={id} />
          </PreviewHeader>

          <PreviewBody>
            <DescriptionList>
              <DescriptionSection
                dKey={"Code"}
                dValue={code}
                isValuePreformatted
              />

              <DescriptionSection
                dKey={"Target role"}
                dValue={target_role}
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
                dKey={"Description"}
                dValue={
                  !description ? (
                    "No description provided"
                  ) : (
                    <EntityDescription>{description}</EntityDescription>
                  )
                }
              />

              <DescriptionSection
                dKey={"Creator"}
                dValue={
                  !created_by ? undefined : (
                    <LinkInternal
                      href={href("/account/role/administrator/account/:id", {
                        id: created_by.id,
                      })}
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
