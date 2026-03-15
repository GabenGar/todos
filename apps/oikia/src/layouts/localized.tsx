import { href, Outlet, useLocation } from "react-router";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Language, LanguageSwitcher } from "@repo/ui/internationalization";
import { LinkExternal } from "@repo/ui/links";
import { List, ListItem } from "@repo/ui/lists";
import { Loading } from "@repo/ui/loading";
import { LinkInternal } from "#components/link";
import { SITE_TITLE, SOURCE_CODE_URL, SUPPORTED_LANGUAGES } from "#environment";
import { useClient, useTranslation } from "#hooks";
import { createLocalizedLoader } from "#server/lib/router";
//

import type { Route } from "./+types/localized";
import styles from "./localized.module.scss";

export function LocalizedLayout({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language } = loaderData;
  const location = useLocation();
  const client = useClient();
  const currentURL = `${location.pathname}${location.search}${location.hash}`;

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
              <LinkInternal href={href("/:language", { language })}>
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

export const loader = createLocalizedLoader();

export default LocalizedLayout;
