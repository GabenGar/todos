import { Outlet } from "react-router-dom";
import { LinkExternal } from "@repo/ui/links";
import { getLocalizedMessage } from "#lib/localization";

import styles from "./layout.module.scss";

export function Layout() {
  return (
    <>
      <header className={styles.header}>
        {getLocalizedMessage("extension_title")}
      </header>

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
    </>
  );
}
