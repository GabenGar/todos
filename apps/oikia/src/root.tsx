import type { ReactNode } from "react";
import { useSSR, useTranslation } from "react-i18next";
import {
  href,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteLoaderData,
} from "react-router";
import {
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
} from "@repo/ui/articles";
import { Preformatted } from "@repo/ui/formatting";
import { ClientProvider as BaseClientProvider } from "@repo/ui/hooks";
import { Page } from "@repo/ui/pages";
import { LinkInternal } from "#components/link";
import { IS_BROWSER, IS_DEVELOPMENT } from "#environment";
import { DEFAULT_LANGUAGE } from "#lib/internationalization";
import type { ILocalizedProps } from "#lib/pages";
import { getLanguage } from "#server/lib/router";
import { getTranslation, initClientTranslation } from "#translation/lib";
//

import type { Route } from "./+types/root";
import styles from "./root.module.scss";

interface ILayoutProps {
  children: ReactNode;
}

interface ILoaderProps extends ILocalizedProps {}

export const links: Route.LinksFunction = () => [];

export function Layout({ children }: ILayoutProps) {
  const data = useRouteLoaderData<ILoaderProps>("root");

  const language = data?.language ?? DEFAULT_LANGUAGE;

  return (
    <html lang={language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  const { language, translation } = useLoaderData<typeof loader>();

  if (IS_BROWSER) {
    initClientTranslation(language, translation);
  }

  useSSR(translation, language);

  return (
    <BaseClientProvider serverLanguage={language}>
      <Outlet />
    </BaseClientProvider>
  );
}

export function ErrorBoundary({ error, loaderData }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation("translation");
  const language = loaderData?.language ?? DEFAULT_LANGUAGE;
  const heading = t((t) => t.common["Error"]);
  let message = t((t) => t.common["Error"]);
  let details = t((t) => t.common["An unexpected error occurred."]);
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : t((t) => t.common["Error"]);
    details =
      error.status === 404
        ? t((t) => t.common["The requested page could not be found."])
        : error.statusText || details;
  } else if (IS_DEVELOPMENT && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className={styles.main}>
      <Page heading={heading}>
        <Overview headingLevel={2}>
          {() => (
            <>
              <OverviewHeader>{message}</OverviewHeader>

              <OverviewBody>
                <p>{details}</p>
                {stack && (
                  <Preformatted>
                    <code>{stack}</code>
                  </Preformatted>
                )}
              </OverviewBody>

              <OverviewFooter>
                <LinkInternal href={href("/:language", { language })}>
                  Back
                </LinkInternal>
              </OverviewFooter>
            </>
          )}
        </Overview>
      </Page>
    </main>
  );
}

export async function loader({ params }: Route.LoaderArgs) {
  const language = getLanguage(params);
  const translation = await getTranslation(language);

  const props: ILoaderProps = {
    language,
    translation,
  };

  return props;
}

export default App;
