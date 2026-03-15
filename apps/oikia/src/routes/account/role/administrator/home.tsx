import { href } from "react-router";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Page } from "@repo/ui/pages";
import { LinkInternal } from "#components/link";
import { runTransaction } from "#database";
import { selectAccountCount } from "#database/queries/accounts";
import { selectInvitationCount } from "#database/queries/invitations";
import { useTranslation } from "#hooks";
import type { ILocalizedProps } from "#lib/pages";
import { createMetaTitle } from "#lib/router";
import { authenticateAdmin, createLocalizedLoader } from "#server/lib/router";
//

import type { Route } from "./+types/home";

interface IProps extends ILocalizedProps {
  accounts: string;
  invitations: string;
}

/**
 * @TODO client render
 */
function AdministratorPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language, accounts, invitations } = loaderData;
  const heading = t((t) => t.pages["administrator-home"]["Administrator"]);
  const title = createMetaTitle(
    t((t) => t.pages["administrator-home"]["Administrator"]),
  );

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <DescriptionList>
                <DescriptionSection
                  dKey={t((t) => t.pages["administrator-home"]["Accounts"])}
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
                  dKey={t((t) => t.pages["administrator-home"]["Invitations"])}
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

export const loader = createLocalizedLoader(async function loader(
  { request }: Route.LoaderArgs,
  localizedProps,
) {
  await authenticateAdmin(request);

  const { accounts, invitations } = await runTransaction(
    async (transaction) => {
      const accountCount = await selectAccountCount(transaction);
      const invitationCount = await selectInvitationCount(transaction);
      const result = { accounts: accountCount, invitations: invitationCount };

      return result;
    },
  );

  const props: IProps = {
    ...localizedProps,
    accounts,
    invitations,
  };

  return props;
});

export default AdministratorPage;
