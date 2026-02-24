import { href } from "react-router";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Page } from "@repo/ui/pages";
import { LinkInternal } from "#components/link";
import { runTransaction } from "#database";
import { selectAccountCount } from "#database/queries/accounts";
import { selectInvitationCount } from "#database/queries/invitations";
import type { ITranslationPageProps } from "#lib/internationalization";
import { createMetaTitle } from "#lib/router";
import { authenticateAdmin, getLanguage } from "#server/lib/router";
import { getTranslation } from "#server/localization";
//

import type { Route } from "./+types/home";

interface IProps extends ITranslationPageProps<"administrator-home"> {
  accounts: string;
  invitations: string;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { translation } = loaderData;
  const title = createMetaTitle(translation["Administrator"]);

  return [{ title }];
}

/**
 * @TODO client render
 */
function AdministratorPage({ loaderData }: Route.ComponentProps) {
  const { language, translation, accounts, invitations } = loaderData;
  const heading = translation["Administrator"];

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <DescriptionList>
                <DescriptionSection
                  dKey={translation["Accounts"]}
                  dValue={
                    <LinkInternal
                      href={href(
                        "/:language/account/role/administrator/accounts",
                        { language },
                      )}
                    >
                      {accounts}
                    </LinkInternal>
                  }
                  isHorizontal
                />

                <DescriptionSection
                  dKey={translation["Invitations"]}
                  dValue={
                    <LinkInternal
                      href={href(
                        "/:language/account/role/administrator/invitations",
                        { language },
                      )}
                    >
                      {invitations}
                    </LinkInternal>
                  }
                  isHorizontal
                />
              </DescriptionList>
            </OverviewHeader>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);
  const language = getLanguage(params);
  const { pages } = await getTranslation(language);
  const translation = pages["administrator-home"];

  const { accounts, invitations } = await runTransaction(
    async (transaction) => {
      const accountCount = await selectAccountCount(transaction);
      const invitationCount = await selectInvitationCount(transaction);
      const result = { accounts: accountCount, invitations: invitationCount };

      return result;
    },
  );

  const props: IProps = {
    language,
    translation,
    accounts,
    invitations,
  };

  return props;
}

export default AdministratorPage;
