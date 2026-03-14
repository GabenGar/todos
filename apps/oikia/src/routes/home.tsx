import { href } from "react-router";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { List, ListItem } from "@repo/ui/lists";
import { Page } from "@repo/ui/pages";
import { Form } from "#components/forms";
import { LinkInternal } from "#components/link";
import { useTranslation } from "#hooks";
import type { ILocalizedProps } from "#lib/pages";
import { createMetaTitle } from "#lib/router";
import { authenticateRequest, getLanguage } from "#server/lib/router";
import { getTranslation } from "#translation/lib";
//

import type { Route } from "./+types/home";
import styles from "./home.module.scss";

interface IProps extends ILocalizedProps {
  isRegistered: boolean;
}

function HomePage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language, isRegistered } = loaderData;
  const title = createMetaTitle(t((t) => t.pages.home.Welcome));
  const heading = t((t) => t.pages.home["Welcome"]);
  const formID = "logout";

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <DescriptionList>
                <DescriptionSection
                  dKey={t((t) => t.pages.home["Authentication"])}
                  dValue={
                    isRegistered ? (
                      <List>
                        <ListItem>
                          <LinkInternal
                            href={href("/:language/account", { language })}
                          >
                            {t((t) => t.pages.home["Account"])}
                          </LinkInternal>
                        </ListItem>

                        <ListItem className={styles.logout}>
                          <Form
                            id={formID}
                            method="POST"
                            action={href("/:language/authentication/logout", {
                              language,
                            })}
                            submitButton={() =>
                              t((t) => t.pages.home["Log out"])
                            }
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
                            {t((t) => t.pages.home["Register"])}
                          </LinkInternal>
                        </ListItem>

                        <ListItem>
                          <LinkInternal
                            href={href("/:language/authentication/login", {
                              language,
                            })}
                          >
                            {t((t) => t.pages.home["Log in"])}
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
  const translation = await getTranslation(language);
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
    translation,
    isRegistered,
  };

  return props;
}

export default HomePage;
