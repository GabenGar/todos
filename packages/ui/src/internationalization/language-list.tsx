import { parse as parseLocale } from "bcp-47";
import { type ILinkProps, Link } from "#links";
import { type IUnorderedListProps, ListItem, ListUnordered } from "#lists";
import { createBlockComponent } from "#meta";
import { Language } from "./language";
//

import styles from "./language-list.module.scss";

export interface ILanguageListProps
  extends IUnorderedListProps,
    Pick<ILinkProps, "internalLinkElement"> {
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
  internalLinkElement,
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
          internalLinkElement={internalLinkElement}
        />
      ))}
    </ListUnordered>
  );
}

interface ILocaleItemsProps
  extends Pick<
    ILanguageListProps,
    "currentLocale" | "currentURL" | "getLocalizedURL" | "internalLinkElement"
  > {
  locale: string;
}

function LocaleItem({
  locale,
  currentLocale,
  currentURL,
  getLocalizedURL,
  internalLinkElement,
}: ILocaleItemsProps) {
  // biome-ignore lint/style/noNonNullAssertion: just typescript things
  const language = parseLocale(locale).language!;
  const href = getLocalizedURL(locale, currentURL);

  return (
    <ListItem>
      {locale === currentLocale ? (
        <Language language={language} />
      ) : (
        <Link
          className={styles.link}
          href={href}
          internalLinkElement={internalLinkElement}
        >
          <Language language={language} />
        </Link>
      )}
    </ListItem>
  );
}
