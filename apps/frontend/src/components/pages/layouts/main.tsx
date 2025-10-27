import { useEffect, type ReactNode } from "react";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Loading } from "@repo/ui/loading";
import { REPOSITORY_URL } from "#environment";
import { type ILocale } from "#lib/internationalization";
import { type ILocalizationCommon } from "#lib/localization";
import { ClientProvider, useServiceWorker } from "#hooks";
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

        <DescriptionList>
          <ServiceWorkerOverview common={common} />
        </DescriptionList>
      </footer>
    </ClientProvider>
  );
}

interface IServiceWorkerOverviewProps extends Pick<IProps, "common"> {}
function ServiceWorkerOverview({ common }: IServiceWorkerOverviewProps) {
  const serviceWorker = useServiceWorker();
  const { layout } = common;

  return (
    <DescriptionSection
      dKey={layout["Service Worker"]}
      dValue={
        !serviceWorker ? (
          <Loading />
        ) : serviceWorker.state === "installing" ? (
          layout["Installing"]
        ) : serviceWorker.state === "activating" ? (
          layout["Waiting"]
        ) : serviceWorker.state === "activated" ? (
          layout["Active"]
        ) : undefined
      }
      isHorizontal
    />
  );
}
