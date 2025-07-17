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
import type {
  ICommonTranslationProps,
  IEntityTranslationProps,
  ILanguageProps,
} from "#lib/internationalization";
import type { IAccountDBPreview } from "#database/queries/accounts";
import { LinkInternal } from "#components/link";

interface IProps
  extends ILanguageProps,
    ICommonTranslationProps,
    IEntityTranslationProps<"account">,
    IPreviewProps {
  account: IAccountDBPreview;
}

export const AccountPreview: ReturnType<typeof createBlockComponent<IProps>> =
  createBlockComponent(undefined, Component);

function Component({ language, commonTranslation, entityTranslation, account, ...props }: IProps) {
  const translation = entityTranslation.account;
  const { id, name, role, created_at } = account;
  const parsedName = parseName(name);

  return (
    <Preview {...props}>
      {(headingLevel) => (
        <>
          <PreviewHeader>
            <Heading level={headingLevel}>
              <LinkInternal
                href={href(
                  "/:language/account/role/administrator/account/:id",
                  {
                    language,
                    id,
                  },
                )}
              >
                {parsedName}
              </LinkInternal>
            </Heading>

            <EntityID entityID={id} />
          </PreviewHeader>

          <PreviewBody>
            <DescriptionList>
              <DescriptionSection
                dKey={translation["Role"]}
                dValue={role}
                isValuePreformatted
                isHorizontal
              />

              <DescriptionSection
                dKey={translation["Join date"]}
                dValue={<DateTimeView translation={commonTranslation} dateTime={created_at} />}
              />
            </DescriptionList>
          </PreviewBody>
        </>
      )}
    </Preview>
  );
}
