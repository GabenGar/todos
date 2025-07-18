import { href } from "react-router";
import { parse as parseLocale } from "bcp-47";
import iso6391 from "iso-639-1";
import { Overview, OverviewBody } from "@repo/ui/articles";
import { Page } from "@repo/ui/pages";
import { List, ListItem } from "@repo/ui/lists";
import { LinkButton } from "#components/link";
import { LANGUAGES, type ILanguage } from "#lib/internationalization";
import { createMetaTitle } from "#lib/router";

// biome-ignore lint/correctness/noUnusedImports: fuck off biome
import type { Route } from "./+types/language-select";

import styles from "./language-select.module.scss";

export function meta(
  // args: Route.MetaArgs
) {
  const title = createMetaTitle();

  return [{ title }];
}

function LanguageSelectPage() {
  const heading = "Oikia";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <OverviewBody>
            <List className={styles.list}>
              {LANGUAGES.map((locale) => (
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
  locale: ILanguage;
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
