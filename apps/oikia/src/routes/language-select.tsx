import { parse as parseLocale } from "bcp-47";
import iso6391 from "iso-639-1";
import { href } from "react-router";
import { Overview, OverviewBody } from "@repo/ui/articles";
import { List, ListItem } from "@repo/ui/lists";
import { Page } from "@repo/ui/pages";
import { LinkButton } from "#components/link";
import { SITE_TITLE, SUPPORTED_LANGUAGES } from "#environment";
import { createMetaTitle } from "#lib/router";
import type { ILocale } from "#translation/lib";
//

// biome-ignore lint/correctness/noUnusedImports: fuck off biome
import type { Route } from "./+types/language-select";
import styles from "./language-select.module.scss";

function LanguageSelectPage() {
  const heading = SITE_TITLE;
  const title = createMetaTitle();

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <OverviewBody>
            <List className={styles.list}>
              {SUPPORTED_LANGUAGES.map((locale) => (
                <ListItem key={locale} className={styles.item}>
                  <LocaleLink locale={locale} />
                </ListItem>
              ))}
            </List>
          </OverviewBody>
        )}
      </Overview>
    </Page>
  );
}

interface ILocalLinkProps {
  locale: ILocale;
}

function LocaleLink({ locale }: ILocalLinkProps) {
  const language = parseLocale(locale).language;

  if (!language) {
    throw new Error(`No language was found for locale "${locale}".`);
  }

  return (
    <LinkButton
      className={styles.link}
      href={href("/:language", { language: locale })}
    >
      <span>
        <span className={styles.language}>{language}</span>{" "}
        {iso6391.getNativeName(language)} ({iso6391.getName(language)})
      </span>
    </LinkButton>
  );
}

export default LanguageSelectPage;
