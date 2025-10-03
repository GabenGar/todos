import { Suspense } from "react";
import {
  usePathname,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation";
import { parse as parseLocale } from "bcp-47";
import { Language } from "@repo/ui/internationalization";
import { SITE_TITLE } from "#environment";
import { LOCALES } from "#lib/internationalization";
import { createHomePageURL } from "#lib/urls";
import { Details, Loading } from "#components";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import type { ILocalizableProps } from "./types";

import styles from "./global-navigation.module.scss";

export function GlobalNavigation({ language }: ILocalizableProps) {
  const pathName = usePathname();
  const homePageURL = createHomePageURL(language);
  const isActive = pathName === homePageURL;

  return (
    <nav className={styles.block}>
      <List className={styles.list}>
        <ListItem>
          {!isActive ? (
            <Link href={homePageURL}>{SITE_TITLE}</Link>
          ) : (
            <span>{SITE_TITLE}</span>
          )}
        </ListItem>

        <ListItem>
          <Suspense fallback={<Loading />}>
            <LocaleSwitcher />
          </Suspense>
        </ListItem>
      </List>
    </nav>
  );
}

export function LocaleSwitcher() {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = pathName.split("/")[1];
  const language = parseLocale(currentLocale).language!;

  return (
    <Details
      className={styles.locale}
      summary={<Language language={language} />}
    >
      <List className={styles.localeList}>
        {LOCALES.map((locale) => (
          <LocaleItem
            key={locale}
            locale={locale}
            currentLocale={currentLocale}
            pathName={pathName}
            searchParams={searchParams}
          />
        ))}
      </List>
    </Details>
  );
}

interface ILocaleItemsProps {
  locale: string;
  currentLocale: string;
  pathName: string;
  searchParams: ReadonlyURLSearchParams;
}

function LocaleItem({
  locale,
  currentLocale,
  pathName,
  searchParams,
}: ILocaleItemsProps) {
  const language = parseLocale(locale).language!;
  const serializedParams =
    searchParams.size === 0 ? "" : `?${String(searchParams)}`;
  const href = `${getRedirectedPathName(locale, pathName)}${serializedParams}`;

  return (
    <ListItem>
      {locale === currentLocale ? (
        <Language language={language} />
      ) : (
        <Link className={styles.localeLink} href={href}>
          <Language language={language} />
        </Link>
      )}
    </ListItem>
  );
}

function getRedirectedPathName(locale: string, pathName: string) {
  const segments = pathName.split("/");
  segments[1] = locale;

  return segments.join("/");
}
