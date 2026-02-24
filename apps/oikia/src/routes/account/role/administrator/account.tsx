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
import type { ICommonTranslationPageProps } from "#lib/internationalization";
import { createMetaTitle } from "#lib/router";
import { authenticateAdmin, getLanguage } from "#server/lib/router";
import { getTranslation } from "#server/localization";
//

import type { Route } from "./+types/account";

interface IProps extends ICommonTranslationPageProps<"account-overview"> {
  account: IAccountDB;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { translation, account } = loaderData;
  const { id, name } = account;
  const parsedName = parseName(name, id);
  const title = createMetaTitle(
    `${translation["Account"]} ${parsedName} ${translation["overview"]}`,
  );

  return [{ title }];
}

function InvitationOverviewPage({ loaderData }: Route.ComponentProps) {
  const { language, commonTranslation, translation, account } = loaderData;
  const { id, role, name, created_at, invited_through } = account;
  const parsedName = parseName(name);
  const heading = translation["Account Overview"];

  return (
    <Page heading={heading}>
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
                  dKey={translation["Role"]}
                  dValue={role}
                  isHorizontal
                />

                <DescriptionSection
                  dKey={translation["Join date"]}
                  dValue={
                    <DateTimeView
                      translation={commonTranslation}
                      dateTime={created_at}
                    />
                  }
                />

                {invited_through && (
                  <DescriptionSection
                    dKey={translation["Invited through"]}
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

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const { id } = params;
  const language = getLanguage(params);
  const { pages, common: commonTranslation } = await getTranslation(language);
  const translation = pages["account-overview"];

  const account = await runTransaction(async (transaction) => {
    const [account] = await selectAccountEntities(transaction, [id]);

    return account;
  });

  const props: IProps = {
    language,
    commonTranslation,
    translation,
    account,
  };

  return props;
}

export default InvitationOverviewPage;
