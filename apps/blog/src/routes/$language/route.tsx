import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useSSR } from "react-i18next";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Language, LanguageSwitcher } from "@repo/ui/internationalization";
import { LinkExternal } from "@repo/ui/links";
import { List, ListItem } from "@repo/ui/lists";
import { Loading } from "@repo/ui/loading";
import { LinkInternal } from "#components/links";
import {
  IS_BROWSER,
  SITE_TITLE,
  SOURCE_CODE_URL,
  SUPPORTED_LANGUAGES,
} from "#environment";
import { useClient, useTranslation } from "#hooks";
import {
  getTranslation,
  initClientTranslation,
  isSupportedLanguage,
} from "#translation";
//

import styles from "./route.module.scss";

function LocalizedLayout() {
  const { language, translation } = Route.useLoaderData();
  const { t } = useTranslation();
  const client = useClient();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const currentURL = `${location.pathname}${search}${location.hash}`;

  if (IS_BROWSER) {
    initClientTranslation(language, translation);
  }

  useSSR(translation, language);

  function getLocalizedURL(locale: string, currentURL: string): string {
    const segments = currentURL.split("/");

    // the first element is an empty string due to slash at start
    segments[1] = locale;

    const resultPath = segments.join("/");

    return resultPath;
  }

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <List className={styles.list}>
            <ListItem>
              <LinkInternal to={"/$language"} params={{ language }}>
                {SITE_TITLE}
              </LinkInternal>
            </ListItem>

            <ListItem>
              <LanguageSwitcher
                locales={SUPPORTED_LANGUAGES}
                currentLocale={language}
                currentURL={currentURL}
                getLocalizedURL={getLocalizedURL}
                InternalLinkComponent={LinkInternal}
              />
            </ListItem>
          </List>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <List className={styles.flist}>
          <ListItem>
            <LinkExternal href={SOURCE_CODE_URL}>
              {t((t) => t.common.layout["source-code"])}
            </LinkExternal>
          </ListItem>

          <ListItem>
            <DescriptionList className={styles.client}>
              <DescriptionSection
                dKey={t((t) => t.common.layout["client-language"])}
                dValue={
                  !client ? (
                    <Loading />
                  ) : (
                    <Language language={client.locale.language} />
                  )
                }
              />
            </DescriptionList>
          </ListItem>
        </List>
      </footer>
    </>
  );
}

export const Route = createFileRoute("/$language")({
  component: LocalizedLayout,
  loader: async ({ params }) => {
    const { language } = params;

    if (!isSupportedLanguage(language)) {
      throw new Error(`Unknown locale "${language}".`);
    }

    const translation = await getTranslation(language);

    return {
      language,
      translation,
    };
  },
});
