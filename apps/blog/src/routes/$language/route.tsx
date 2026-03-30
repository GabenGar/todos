import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Language, LanguageSwitcher } from "@repo/ui/internationalization";
import { LinkExternal } from "@repo/ui/links";
import { List, ListItem } from "@repo/ui/lists";
import { Loading } from "@repo/ui/loading";
import { LinkInternal } from "#components/links";
import { SITE_TITLE, SOURCE_CODE_URL, SUPPORTED_LANGUAGES } from "#environment";
import { useClient, useTranslation } from "#hooks";
//

import styles from "./route.module.scss";

function LocalizedLayout() {
  const { t, i18n } = useTranslation();
  const client = useClient();
  const location = useLocation();
  const language = i18n.language;
  const search = new URLSearchParams(location.search);
  const currentURL = `${location.pathname}${search}${location.hash}`;

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
                currentLocale={i18n.language}
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
              {t((t) => t.common["Source Code"])}
            </LinkExternal>
          </ListItem>

          <ListItem>
            <DescriptionList className={styles.client}>
              <DescriptionSection
                dKey={t((t) => t.common["Client language"])}
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
});
