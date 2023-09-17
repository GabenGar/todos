"use client";

import type { Route } from "next";
import { usePathname } from "next/navigation";
import { SITE_TITLE } from "#environment";
import { LOCALES } from "#lib/internationalization";
import { homePageURL } from "#lib/urls";
import { Link } from "./link";

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

  return (
    <ul>
      {LOCALES.map((locale) => (
        <li key={locale}>
          <Link href={redirectedPathName(locale, pathName) as Route}>
            {locale}
          </Link>
        </li>
      ))}
    </ul>
  );
}

const redirectedPathName = (locale: string, pathName: string) => {
  if (!pathName) {
    return "/";
  }

  const segments = pathName.split("/");
  segments[1] = locale;

  return segments.join("/");
};
