import type { ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { LinkExternal } from "@repo/ui/links";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";

import type { Route } from "./+types/root";

import "@repo/ui/styles/global";
import styles from "./root.module.scss";
import { LinkInternal } from "#components/link";

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
    <>
      <header className={styles.header}><LinkInternal href={"/"}>Oikia</LinkInternal></header>

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
    </>
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
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>{message}</OverviewHeader>
            <OverviewBody>
              <p>{details}</p>
              {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                  <code>{stack}</code>
                </pre>
              )}
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export default App;
