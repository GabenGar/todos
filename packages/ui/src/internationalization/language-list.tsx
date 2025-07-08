import { parse as parseLocale } from "bcp-47";
import { createBlockComponent } from "#meta";
import { ListItem, ListUnordered, type IUnorderedListProps } from "#lists";
import { Link } from "#links";
import { Language } from "./language";

import styles from "./language-list.module.scss";

export interface ILanguageListProps extends IUnorderedListProps {
  locales: readonly string[];
  currentLocale: string;
  currentURL: string;
  getLocalizedURL: (locale: string, currentURL: string) => string;
}

export const LanguageList = createBlockComponent(styles, Component);

function Component({
  locales,
  currentLocale,
  currentURL,
  getLocalizedURL,
  ...props
}: ILanguageListProps) {
  return (
    <ListUnordered {...props}>
      {locales.map((locale) => (
        <LocaleItem
          key={locale}
          locale={locale}
          currentLocale={currentLocale}
          currentURL={currentURL}
          getLocalizedURL={getLocalizedURL}
        />
      ))}
    </ListUnordered>
  );
}

interface ILocaleItemsProps
  extends Pick<ILanguageListProps, "currentLocale" | "currentURL" | "getLocalizedURL"> {
  locale: string;
}

function LocaleItem({
  locale,
  currentLocale,
  currentURL,
  getLocalizedURL,
}: ILocaleItemsProps) {
  // biome-ignore lint/style/noNonNullAssertion: just typescript things
  const language = parseLocale(locale).language!;
  const href = getLocalizedURL(locale, currentURL);

  return (
    <ListItem>
      {locale === currentLocale ? (
        <Language language={language} />
      ) : (
        <Link className={styles.link} href={href}>
          <Language language={language} />
        </Link>
      )}
    </ListItem>
  );
}
