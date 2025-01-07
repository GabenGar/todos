import { Outlet, ScrollRestoration } from "react-router-dom";
import { LinkExternal } from "@repo/ui/links";
import { ClientProvider } from "#popup/hooks";
import { getLocalizedMessage } from "#lib/localization";
import { LayoutHeader } from "./header";

import styles from "./layout.module.scss";

export function Layout() {
  return (
    <ClientProvider>
      <LayoutHeader className={styles.header} />

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <ul>
          <li>
            <LinkExternal
              href={
                "https://github.com/GabenGar/todos/tree/master/apps/extension"
              }
            >
              {getLocalizedMessage("Source code")}
            </LinkExternal>
          </li>
        </ul>
      </footer>

      <ScrollRestoration />
    </ClientProvider>
  );
}
