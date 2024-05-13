import { parse as parseLocale } from "bcp-47";
import iso6391 from "iso-639-1";
import { SITE_TITLE } from "#environment";
import { LOCALES, type ILocale } from "#lib/internationalization";
import { createHomePageURL } from "#lib/urls";
import { Page } from "#components";
import { List, ListItem } from "#components/list";
import { LinkButton } from "#components/link";
import { Overview, OverviewBody } from "#components/overview";

import styles from "./page.module.scss";

export async function generateMetadata() {
  return {
    title: SITE_TITLE,
  };
}

/**
 * @TODO language guesser to show "choose language text"
 * @TODO center text in a container
 */
async function FrontPage() {
  return (
    <Page heading={SITE_TITLE}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <OverviewBody>
            <List className={styles.list}>
              {LOCALES.map((locale) => (
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
  const language = parseLocale(locale).language!;

  return (
    <LinkButton className={styles.link} href={createHomePageURL(locale)}>
      <span>
        <span className={styles.language}>{language}</span>{" "}
        {iso6391.getNativeName(language)} ({iso6391.getName(language)})
      </span>
    </LinkButton>
  );
}

export default FrontPage;
