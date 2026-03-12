import { type ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { GlobalNavigation } from "#components";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import { REPOSITORY_URL } from "#environment";
import { ClientProvider, useServiceWorker } from "#hooks";
import type { ILocale } from "#lib/internationalization";
//

import styles from "./main.module.scss";

interface IProps {
  children: ReactNode;
}

export function MainLayout({ children }: IProps) {
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language as ILocale;
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
            <Link href={REPOSITORY_URL}>{t(($) => $.layout.source_code)}</Link>
          </ListItem>
        </List>

        <DescriptionList>
          <ServiceWorkerOverview />
        </DescriptionList>
      </footer>
    </ClientProvider>
  );
}

function ServiceWorkerOverview() {
  const { t } = useTranslation("common");
  const serviceWorkerContext = useServiceWorker();

  return (
    <DescriptionSection
      dKey={t(($) => $.layout.service_worker["Service Worker"])}
      dValue={t(
        ($) => $.layout.service_worker.status[serviceWorkerContext.status],
      )}
      isHorizontal
    />
  );
}
