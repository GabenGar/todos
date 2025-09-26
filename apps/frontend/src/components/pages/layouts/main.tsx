import { use, type ReactNode } from "react";
import { REPOSITORY_URL } from "#environment";
import { DEFAULT_LOCALE, validateLocale } from "#lib/internationalization";
import { getDictionary } from "#lib/localization";
import { ClientProvider } from "#hooks";
import { GlobalNavigation } from "#components";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";

import styles from "./main.module.scss";

interface IProps {
  children: ReactNode;
}

export function MainLayout({ children }: IProps) {
  const lang = DEFAULT_LOCALE;
  validateLocale(lang);
  const dict = use(getDictionary(lang));
  const { layout } = dict;

  return (
    <ClientProvider>
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
