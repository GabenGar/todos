import type { ReactNode } from "react";
import {
  href,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { LinkExternal } from "@repo/ui/links";
import { ClientProvider } from "@repo/ui/hooks";
import { Page } from "@repo/ui/pages";
import {
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
} from "@repo/ui/articles";
import { Preformatted } from "@repo/ui/formatting";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/root";

import "@repo/ui/styles/global";
import styles from "./root.module.scss";

interface IProps {
  children: ReactNode;
}

export const links: Route.LinksFunction = () => [];

export function Layout({ children }: IProps) {
  return (
    <html lang="en">
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
  return (
    <ClientProvider>
      <header className={styles.header}>
        <LinkInternal href={href("/")}>Oikia</LinkInternal>
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
              Source Code
            </LinkExternal>
          </li>
        </ul>
      </footer>
    </ClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const heading = "Error";
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
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
                <LinkInternal href={href("/")}>Back</LinkInternal>
              </OverviewFooter>
            </>
          )}
        </Overview>
      </Page>
    </main>
  );
}

export default App;
