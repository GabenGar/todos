import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { List, ListItem } from "@repo/ui/lists";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import type {
  ICommonTranslationProps,
  ITranslationPageProps,
} from "#lib/internationalization";
import { createMetaTitle } from "#lib/router";
import { authenticateRequest, getLanguage } from "#server/lib/router";
import { getTranslation } from "#server/localization";
import { LinkInternal } from "#components/link";
import { Form } from "#components/forms";

import type { Route } from "./+types/home";

import styles from "./home.module.scss";

interface IProps
  extends ICommonTranslationProps,
    ITranslationPageProps<"home"> {
  isRegistered: boolean;
}

export function meta({ data }: Route.MetaArgs) {
  const { translation } = data;
  const title = createMetaTitle(translation["Welcome"]);

  return [{ title }];
}

function HomePage({ loaderData }: Route.ComponentProps) {
  const { language, commonTranslation, translation, isRegistered } = loaderData;
  const heading = translation["Welcome"];
  const formID = "logout";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <DescriptionList>
                <DescriptionSection
                  dKey={translation["Authentication"]}
                  dValue={
                    isRegistered ? (
                      <List>
                        <ListItem>
                          <LinkInternal
                            href={href("/:language/account", { language })}
                          >
                            {translation["Account"]}
                          </LinkInternal>
                        </ListItem>

                        <ListItem className={styles.logout}>
                          <Form
                            commonTranslation={commonTranslation}
                            id={formID}
                            method="POST"
                            action={href("/:language/authentication/logout", {
                              language,
                            })}
                            submitButton={() => translation["Log out"]}
                          />
                        </ListItem>
                      </List>
                    ) : (
                      <List>
                        <ListItem>
                          <LinkInternal
                            href={href(
                              "/:language/authentication/registration",
                              { language },
                            )}
                          >
                            {translation["Register"]}
                          </LinkInternal>
                        </ListItem>

                        <ListItem>
                          <LinkInternal
                            href={href("/:language/authentication/login", {
                              language,
                            })}
                          >
                            {translation["Log in"]}
                          </LinkInternal>
                        </ListItem>
                      </List>
                    )
                  }
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
  const language = getLanguage(params);
  const { common: commonTranslation, pages } = await getTranslation(language);
  const translation = pages.home;
  let isRegistered: boolean;

  try {
    await authenticateRequest(request);
    isRegistered = true;
  // biome-ignore lint/correctness/noUnusedVariables: no idea what biome expects there
  } catch (error) {
    isRegistered = false;
  }

  const props: IProps = {
    language,
    commonTranslation,
    translation,
    isRegistered,
  };

  return props;
}

export default HomePage;
