import { parse as parseLocale } from "bcp-47";
import { Details, type IDetailsProps } from "#details";
import { createBlockComponent } from "#meta";
import { Language } from "./language";
import { type ILanguageListProps, LanguageList } from "./language-list";
//

import styles from "./switcher.module.scss";

interface IProps
  extends Omit<IDetailsProps, "summary" | "contentClassname">,
    Pick<
      ILanguageListProps,
      | "locales"
      | "currentLocale"
      | "currentURL"
      | "getLocalizedURL"
      | "internalLinkElement"
    > {}

export const LanguageSwitcher = createBlockComponent(styles, Component);

function Component({
  locales,
  currentLocale,
  currentURL,
  getLocalizedURL,
  internalLinkElement,
  ...props
}: IProps) {
  // biome-ignore lint/style/noNonNullAssertion: just typescript things
  const language = parseLocale(currentLocale).language!;

  return (
    <Details
      {...props}
      contentClassname={styles.content}
      summary={<Language language={language} />}
    >
      <LanguageList
        locales={locales}
        currentLocale={currentLocale}
        currentURL={currentURL}
        getLocalizedURL={getLocalizedURL}
        internalLinkElement={internalLinkElement}
      />
    </Details>
  );
}
