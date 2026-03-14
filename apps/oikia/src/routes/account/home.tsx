import { href } from "react-router";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { DateTimeView } from "@repo/ui/dates";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { parseName } from "@repo/ui/entities";
import { Heading } from "@repo/ui/headings";
import { Page } from "@repo/ui/pages";
import { LinkInternal } from "#components/link";
import type { IAccount } from "#entities/account";
import { useTranslation } from "#hooks";
import type { ILocalizedProps } from "#lib/pages";
import { createMetaTitle } from "#lib/router";
import { authenticateRequest, createLocalizedLoader } from "#server/lib/router";
//

import type { Route } from "./+types/home";

interface IProps extends ILocalizedProps {
  account: IAccount;
}

/**
 * @TODO client render
 */
function AccountPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language, account } = loaderData;
  const { name, role, created_at } = account;
  const parsedName = parseName(name);
  const title = createMetaTitle(t((t) => t.pages["account-home"]["Account"]));
  const heading = t((t) => t.pages["account-home"]["Account"]);

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Heading level={headingLevel + 1}>{parsedName}</Heading>
            </OverviewHeader>

            <OverviewBody>
              <DescriptionList>
                <DescriptionSection
                  dKey={t((t) => t.pages["account-home"]["Role"])}
                  dValue={
                    role !== "administrator" ? (
                      role
                    ) : (
                      <LinkInternal
                        href={href("/:language/account/role/administrator", {
                          language,
                        })}
                      >
                        {t((t) => t.pages["account-home"][role])}
                      </LinkInternal>
                    )
                  }
                  isHorizontal
                />

                <DescriptionSection
                  dKey={t((t) => t.pages["account-home"]["Joined"])}
                  dValue={
                    <DateTimeView
                      dateTime={created_at}
                    />
                  }
                />
              </DescriptionList>
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export const loader = createLocalizedLoader<IProps, Route.LoaderArgs>(
  async ({ request }: Route.LoaderArgs, localizedProps) => {
    const { id: _, ...account } = await authenticateRequest(request);
    const props: IProps = {
      ...localizedProps,
      account,
    };

    return props;
  },
);

export default AccountPage;
