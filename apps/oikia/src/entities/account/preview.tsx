import { href } from "react-router";
import { DateTimeView } from "@repo/ui/dates";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { EntityID, parseName } from "@repo/ui/entities";
import { Heading } from "@repo/ui/headings";
import { createBlockComponent } from "@repo/ui/meta";
import {
  type IPreviewProps,
  Preview,
  PreviewBody,
  PreviewHeader,
} from "@repo/ui/previews";
import { LinkInternal } from "#components/link";
import type { IAccountDBPreview } from "#database/queries/accounts";
import { useTranslation } from "#hooks";
import type { ILanguageProps } from "#lib/internationalization";

interface IProps extends ILanguageProps, IPreviewProps {
  account: IAccountDBPreview;
}

export const AccountPreview: ReturnType<typeof createBlockComponent<IProps>> =
  createBlockComponent(undefined, Component);

function Component({ language, account, ...props }: IProps) {
  const { t } = useTranslation();
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
                dKey={t((t) => t.entities.account["Role"])}
                dValue={role}
                isValuePreformatted
                isHorizontal
              />

              <DescriptionSection
                dKey={t((t) => t.entities.account["Join date"])}
                dValue={<DateTimeView dateTime={created_at} />}
              />
            </DescriptionList>
          </PreviewBody>
        </>
      )}
    </Preview>
  );
}
