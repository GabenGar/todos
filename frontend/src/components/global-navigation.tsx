"use client";

import type { Route } from "next";
import { usePathname } from "next/navigation";
import { parse as parseLocale } from "bcp-47";
import iso6391 from "iso-639-1";
import { SITE_TITLE } from "#environment";
import { LOCALES } from "#lib/internationalization";
import { homePageURL } from "#lib/urls";
import { Details } from "#components";
import { Link } from "#components/link";

import styles from "./global-navigation.module.scss";

export function GlobalNavigation() {
  const pathname = usePathname();
  const isActive = pathname === homePageURL;

  return (
    <nav className={styles.block}>
      <ul className={styles.list}>
        <li>
          {!isActive ? (
            <Link href={homePageURL}>{SITE_TITLE}</Link>
          ) : (
            <span>{SITE_TITLE}</span>
          )}
        </li>

        <li>
          <LocaleSwitcher />
        </li>
      </ul>
    </nav>
  );
}

export function LocaleSwitcher() {
  const pathName = usePathname();
  const currentLocale = pathName.split("/")[1];

  return (
    <Details className={styles.locale} summary={currentLocale}>
      <ul className={styles.localeList}>
        {LOCALES.map((locale) => (
          <LocaleItem
            key={locale}
            locale={locale}
            currentLocale={currentLocale}
            pathName={pathName}
          />
        ))}
      </ul>
    </Details>
  );
}

interface ILocaleItemsProps {
  locale: string;
  currentLocale: string;
  pathName: string;
}

function LocaleItem({ locale, currentLocale, pathName }: ILocaleItemsProps) {
  const language = parseLocale(locale).language!;

  return (
    <li>
      {locale === currentLocale ? (
        <span>{language}</span>
      ) : (
        <Link href={getRedirectedPathName(locale, pathName) as Route}>
          {language} {iso6391.getNativeName(language)} (
          {iso6391.getName(language)})
        </Link>
      )}
    </li>
  );
}

function getRedirectedPathName(locale: string, pathName: string) {
  if (!pathName) {
    return "/";
  }

  const segments = pathName.split("/");
  segments[1] = locale;

  return segments.join("/");
}
