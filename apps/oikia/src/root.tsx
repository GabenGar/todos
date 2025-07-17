import type { ReactNode } from "react";
import {
  href,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useParams,
  useRouteLoaderData,
} from "react-router";
import { ClientProvider as BaseClientProvider } from "@repo/ui/hooks";
import { Page } from "@repo/ui/pages";
import {
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
} from "@repo/ui/articles";
import { Preformatted } from "@repo/ui/formatting";
import englishTranslation from "#localization/en";
import { IS_DEVELOPMENT } from "#environment";
import {
  DEFAULT_LANGUAGE,
  type ICommonTranslationProps,
  type ILanguageProps,
} from "#lib/internationalization";
import { getLanguage } from "#server/lib/router";
import { getCommonTranslation } from "#server/localization";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/root";

import styles from "./root.module.scss";

interface ILayoutProps {
  children: ReactNode;
}

interface ILoaderProps extends ILanguageProps, ICommonTranslationProps {}

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
  const params = useParams();
  const language = params.language;

  return (
    <BaseClientProvider serverLanguage={language}>
      <Outlet />
    </BaseClientProvider>
  );
}

export function ErrorBoundary({ error, loaderData }: Route.ErrorBoundaryProps) {
  const language = loaderData?.language ?? DEFAULT_LANGUAGE;
  const commonTranslation =
    loaderData?.commonTranslation ?? englishTranslation.common;
  const heading = commonTranslation["Error"];
  let message = commonTranslation["Error"];
  let details = commonTranslation["An unexpected error occurred."];
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : commonTranslation["Error"];
    details =
      error.status === 404
        ? commonTranslation["The requested page could not be found."]
        : error.statusText || details;
  } else if (IS_DEVELOPMENT && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className={styles.main}>
      <Page heading={heading}>
        <Overview headingLevel={2}>
          {(headingLevel) => (
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
  const commonTranslation = await getCommonTranslation(language);

  const props: ILoaderProps = {
    language,
    commonTranslation,
  };

  return props;
}

export default App;
