import { href } from "react-router";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { DateTimeView } from "@repo/ui/dates";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { parseName, parseTitle } from "@repo/ui/entities";
import { Preformatted } from "@repo/ui/formatting";
import { Heading } from "@repo/ui/headings";
import { Page } from "@repo/ui/pages";
import { LinkInternal } from "#components/link";
import { runTransaction } from "#database";
import {
  type IAccountDB,
  selectAccountEntities,
} from "#database/queries/accounts";
import { useTranslation } from "#hooks";
import type { ILocalizedProps } from "#lib/pages";
import { createMetaTitle } from "#lib/router";
import { authenticateAdmin, createLocalizedLoader } from "#server/lib/router";
//

import type { Route } from "./+types/account";

interface IProps extends ILocalizedProps {
  account: IAccountDB;
}

function InvitationOverviewPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language, account } = loaderData;
  const { id, role, name, created_at, invited_through } = account;
  const parsedName = parseName(name);
  const title = createMetaTitle(
    `${t((t) => t.pages["account-overview"]["Account"])} ${parsedName} ${t((t) => t.pages["account-overview"]["overview"])}`,
  );
  const heading = t((t) => t.pages["account-overview"]["Account Overview"]);

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Heading level={headingLevel}>{parsedName}</Heading>
              <Preformatted>{id}</Preformatted>
            </OverviewHeader>

            <OverviewBody>
              <DescriptionList>
                <DescriptionSection
                  dKey={t((t) => t.pages["account-overview"]["Role"])}
                  dValue={role}
                  isHorizontal
                />

                <DescriptionSection
                  dKey={t((t) => t.pages["account-overview"]["Join date"])}
                  dValue={<DateTimeView dateTime={created_at} />}
                />

                {invited_through && (
                  <DescriptionSection
                    dKey={t(
                      (t) => t.pages["account-overview"]["Invited through"],
                    )}
                    dValue={
                      <LinkInternal
                        href={href(
                          "/:language/account/role/administrator/invitation/:id",
                          { language, id: invited_through.id },
                        )}
                      >
                        {parseTitle(invited_through.title, invited_through.id)}
                      </LinkInternal>
                    }
                  />
                )}
              </DescriptionList>
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export const loader = createLocalizedLoader(
  async ({ request, params }: Route.LoaderArgs, localizedProps) => {
    await authenticateAdmin(request);

    const { id } = params;

    const account = await runTransaction(async (transaction) => {
      const [account] = await selectAccountEntities(transaction, [id]);

      return account;
    });

    const props: IProps = {
      ...localizedProps,
      account,
    };

    return props;
  },
);

export default InvitationOverviewPage;
