import { Outlet } from "react-router";
import { LinkExternal } from "@repo/ui/links";

import styles from "./layout.module.scss";

export function Layout() {
  return (
    <>
      <header className={styles.header}>Link overwatch</header>

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
              Source code
            </LinkExternal>
          </li>
        </ul>
      </footer>
    </>
  );
}
