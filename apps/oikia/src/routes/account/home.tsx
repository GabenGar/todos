import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Heading } from "@repo/ui/headings";
import { DateTimeView } from "@repo/ui/dates";
import { parseName } from "@repo/ui/entities";
import type { ITranslationPageProps } from "#lib/internationalization";
import { createMetaTitle } from "#lib/router";
import { authenticateRequest, getLanguage } from "#server/lib/router";
import { getTranslation } from "#server/localization";
import { LinkInternal } from "#components/link";
import type { IAccount } from "#entities/account";

import type { Route } from "./+types/home";

interface IProps extends ITranslationPageProps<"account-home"> {
  account: IAccount;
}

export function meta({ data }: Route.MetaArgs) {
  const { translation } = data;
  const title = createMetaTitle(translation["Account"]);

  return [{ title }];
}

/**
 * @TODO client render
 */
function AccountPage({ loaderData }: Route.ComponentProps) {
  const { language, translation, account } = loaderData;
  const { name, role, created_at } = account;
  const parsedName = parseName(name);
  const heading = translation["Account"];

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Heading level={headingLevel + 1}>{parsedName}</Heading>
            </OverviewHeader>

            <OverviewBody>
              <DescriptionList>
                <DescriptionSection
                  dKey={translation["Role"]}
                  dValue={
                    role !== "administrator" ? (
                      role
                    ) : (
                      <LinkInternal
                        href={href("/:language/account/role/administrator", {
                          language,
                        })}
                      >
                        {translation[role]}
                      </LinkInternal>
                    )
                  }
                  isHorizontal
                />

                <DescriptionSection
                  dKey={translation["Joined"]}
                  dValue={<DateTimeView dateTime={created_at} />}
                />
              </DescriptionList>
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const language = getLanguage(params);
  const { pages } = await getTranslation(language);
  const translation = pages["account-home"];
  const { id: _, ...account } = await authenticateRequest(request);

  const props: IProps = {
    language,
    translation,
    account,
  };

  return props;
}

export default AccountPage;
