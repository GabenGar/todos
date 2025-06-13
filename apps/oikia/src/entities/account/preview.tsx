import { href } from "react-router";
import { EntityID, parseName } from "@repo/ui/entities";
import { Heading } from "@repo/ui/headings";
import { createBlockComponent } from "@repo/ui/meta";
import {
  type IPreviewProps,
  Preview,
  PreviewBody,
  PreviewHeader,
} from "@repo/ui/previews";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { DateTimeView } from "@repo/ui/dates";
import type { IAccountDBPreview } from "#database/queries/accounts";
import { LinkInternal } from "#components/link";

interface IProps extends IPreviewProps {
  account: IAccountDBPreview;
}

export const AccountPreview: ReturnType<typeof createBlockComponent<IProps>> =
  createBlockComponent(undefined, Component);

function Component({ account, ...props }: IProps) {
  const { id, name, role, created_at } = account;
  const parsedName = parseName(name);

  return (
    <Preview {...props}>
      {(headingLevel) => (
        <>
          <PreviewHeader>
            <Heading level={headingLevel}>
              <LinkInternal
                href={href("/account/role/administrator/account/:id", {
                  id,
                })}
              >
                {parsedName}
              </LinkInternal>
            </Heading>

            <EntityID entityID={id} />
          </PreviewHeader>

          <PreviewBody>
            <DescriptionList>
              <DescriptionSection
                dKey={"Role"}
                dValue={role}
                isValuePreformatted
                isHorizontal
              />

              <DescriptionSection
                dKey={"Created at"}
                dValue={<DateTimeView dateTime={created_at} />}
              />
            </DescriptionList>
          </PreviewBody>
        </>
      )}
    </Preview>
  );
}
