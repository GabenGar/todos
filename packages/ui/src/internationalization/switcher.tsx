import { parse as parseLocale } from "bcp-47";
import { Details, type IDetailsProps } from "#details";
import { createBlockComponent } from "#meta";
import { Language } from "./language";
import { LanguageList, type ILanguageListProps } from "./language-list";

import styles from "./switcher.module.scss";

interface IProps
  extends Omit<IDetailsProps, "summary">,
    Pick<
      ILanguageListProps,
      "locales" | "currentLocale" | "currentURL" | "getLocalizedURL"
    > {}

export const LanguageSwitcher = createBlockComponent(styles, Component);

function Component({
  locales,
  currentLocale,
  currentURL,
  getLocalizedURL,
  ...props
}: IProps) {
  // biome-ignore lint/style/noNonNullAssertion: just typescript things
  const language = parseLocale(currentLocale).language!;

  return (
    <Details {...props} summary={<Language language={language} />}>
      <LanguageList
        locales={locales}
        currentLocale={currentLocale}
        currentURL={currentURL}
        getLocalizedURL={getLocalizedURL}
      />
    </Details>
  );
}
