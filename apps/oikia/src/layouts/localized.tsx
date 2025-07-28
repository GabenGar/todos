import { href, Outlet, useLocation } from "react-router";
import { LinkExternal } from "@repo/ui/links";
import { List, ListItem } from "@repo/ui/lists";
import { Language, LanguageSwitcher } from "@repo/ui/internationalization";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Loading } from "@repo/ui/loading";
import {
  LANGUAGES,
  type ICommonTranslationProps,
  type ILanguageProps,
} from "#lib/internationalization";
import { getLanguage } from "#server/lib/router";
import { getCommonTranslation } from "#server/localization";
import { useClient } from "#hooks";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/localized";

import "@repo/ui/styles/global";
import styles from "./localized.module.scss";

interface IProps extends ILanguageProps, ICommonTranslationProps {}

export function LocalizedLayout({ loaderData }: Route.ComponentProps) {
  const { language, commonTranslation } = loaderData;
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
        <List className={styles.flist}>
          <ListItem>
            <LinkExternal
              href={"https://github.com/GabenGar/todos/tree/master/apps/oikia"}
            >
              {commonTranslation["Source Code"]}
            </LinkExternal>
          </ListItem>

          <ListItem>
            <DescriptionList className={styles.client}>
              <DescriptionSection
                dKey={commonTranslation["Client language"]}
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
