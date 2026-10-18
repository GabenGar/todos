import { Outlet, ScrollRestoration } from "react-router";
import browser from "webextension-polyfill";
import { Button } from "@repo/ui/buttons";
import { ClientProvider } from "@repo/ui/hooks";
import { LinkExternal } from "@repo/ui/links";
import { List, ListItem } from "@repo/ui/lists";
import { getLocalizedMessage } from "#translation";
//

import styles from "./action.module.scss";

export function ActionLayout() {
  return (
    <ClientProvider>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <ul className={styles.header_list}>
            <li>{getLocalizedMessage("extension_title")}</li>
            <li>
              <Button onClick={() => browser.runtime.openOptionsPage()}>
                {"Options"}
              </Button>
            </li>
          </ul>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <List>
          <ListItem>
            <LinkExternal
              href={
                "https://github.com/GabenGar/todos/tree/master/apps/spooder"
              }
            >
              {"Source code"}
            </LinkExternal>
          </ListItem>
        </List>
      </footer>
      <ScrollRestoration />
    </ClientProvider>
  );
}
