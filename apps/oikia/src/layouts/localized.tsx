import { href, Outlet, useLocation } from "react-router";
import { LinkExternal } from "@repo/ui/links";
import { List, ListItem } from "@repo/ui/lists";
import { LanguageSwitcher } from "@repo/ui/internationalization";
import {
  LANGUAGES,
  type ICommonTranslationProps,
  type ILanguageProps,
} from "#lib/internationalization";
import { getLanguage } from "#server/lib/router";
import { getCommonTranslation } from "#server/localization";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/localized";

import "@repo/ui/styles/global";
import styles from "./localized.module.scss";

interface IProps extends ILanguageProps, ICommonTranslationProps {}

export function LocalizedLayout({ loaderData }: Route.ComponentProps) {
  const { language, commonTranslation } = loaderData;
  const location = useLocation();
  const currentURL = `${location.pathname}${location.search}${location.hash}`;

  function getLocalizedURL(locale: string, currentURL: string): string {
    // stepping over the first slash
    const firstMatch = currentURL.indexOf("/", 1);
    const path = currentURL.slice(firstMatch);
    const resultPath = `/${locale}${path}`;

    return resultPath;
  }

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <List className={styles.list}>
            <ListItem>
              <LinkInternal href={href("/:language", { language })}>
                Oikia
              </LinkInternal>
            </ListItem>

            <ListItem>
              <LanguageSwitcher
                locales={LANGUAGES}
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
        <ul>
          <li>
            <LinkExternal
              href={"https://github.com/GabenGar/todos/tree/master/apps/oikia"}
            >
              {commonTranslation["Source Code"]}
            </LinkExternal>
          </li>
        </ul>
      </footer>
    </>
  );
}

export async function loader({ params }: Route.LoaderArgs) {
  const language = getLanguage(params);
  const commonTranslation = await getCommonTranslation(language);
  const props: IProps = {
    language,
    commonTranslation,
  };

  return props;
}

export default LocalizedLayout;
