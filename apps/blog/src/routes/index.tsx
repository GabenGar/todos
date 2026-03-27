import { createFileRoute, useRouter } from "@tanstack/react-router";
import { parse as parseLocale } from "bcp-47";
import iso6391 from "iso-639-1";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { LinkButton } from "@repo/ui/links";
import { List, ListItem } from "@repo/ui/lists";
import { Page } from "@repo/ui/pages";
import { SUPPORTED_LANGUAGES } from "#environment";
import { createMetaTitle } from "#lib/pages";
import type { ILocale } from "#translation/lib";
//

import styles from "./index.module.scss";

function LanguageSelectPage() {
  const router = useRouter();
  const state = Route.useLoaderData();
  const title = createMetaTitle();
  const heading = createMetaTitle();

  return (
    <Page title={title} heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <OverviewHeader>
            <List className={styles.list}>
              {SUPPORTED_LANGUAGES.map((locale) => (
                <ListItem key={locale} className={styles.item}>
                  <LocaleLink locale={locale} />
                </ListItem>
              ))}
            </List>
          </OverviewHeader>
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

export const Route = createFileRoute("/")({
  component: LanguageSelectPage,
});
