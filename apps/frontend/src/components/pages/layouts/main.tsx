import { type ReactNode } from "react";
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
