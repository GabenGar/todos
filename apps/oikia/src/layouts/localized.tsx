import { href, Outlet } from "react-router";
import { LinkExternal } from "@repo/ui/links";
import type { ICommonTranslationProps, ILanguageProps } from "#lib/internationalization";
import { getLanguage } from "#server/lib/router";
import { getCommonTranslation } from "#server/localization";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/localized";

import "@repo/ui/styles/global";
import styles from "./localized.module.scss";

interface IProps extends ILanguageProps, ICommonTranslationProps {}

export function LocalizedLayout({ loaderData }: Route.ComponentProps) {
  const { language, commonTranslation } = loaderData

  return (
    <>
      <header className={styles.header}>
        <LinkInternal href={href("/:language", { language })}>Oikia</LinkInternal>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <ul>
          <li>
            <LinkExternal
              href={"https://github.com/GabenGar/todos/tree/master/apps/oikia"}
            >
              {commonTranslation["Source Code"]}
            </LinkExternal>
          </li>
        </ul>

      </footer>
    </>
  );
}

export async function loader({ params }: Route.LoaderArgs) {
  const language = getLanguage(params);
  const commonTranslation = await getCommonTranslation(language);
  const props: IProps = {
    language,
    commonTranslation
  }

  return props
}

export default LocalizedLayout;
