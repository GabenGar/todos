import { useEffect, type ReactNode } from "react";
import { REPOSITORY_URL } from "#environment";
import { type ILocale } from "#lib/internationalization";
import { type ILocalizationCommon } from "#lib/localization";
import { ClientProvider } from "#hooks";
import { GlobalNavigation } from "#components";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";

import styles from "./main.module.scss";

interface IProps {
  lang: ILocale;
  common: ILocalizationCommon;
  children: ReactNode;
}

export function MainLayout({ lang, common, children }: IProps) {
  const { layout } = common;

  /**
   * `pages` router doesn't allow to set `"lang"`
   * on `<html>` element during static rendering.
   * This apparently passes some tests:
   * https://stackoverflow.com/a/61902243
   * Otherwise it requires `getInitialProps()` fuckery
   * on `_document.tsx` file.
   */
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <ClientProvider lang={lang}>
      <header className={styles.header}>
        <GlobalNavigation language={lang} />
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <List className={styles.list}>
          <ListItem>
            <Link href={REPOSITORY_URL}>{layout.source_code}</Link>
          </ListItem>
        </List>
      </footer>
    </ClientProvider>
  );
}
