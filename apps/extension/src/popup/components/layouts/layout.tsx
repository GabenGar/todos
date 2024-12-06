
import { Outlet } from "react-router";
import { LayoutHeader } from "./header";

import styles from "./layout.module.scss";

export function Layout() {
  return (
    <>
      <LayoutHeader className={styles.header} />

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <ul>
          <li>
            <a
              href={
                "https://github.com/GabenGar/todos/tree/master/apps/extension"
              }
            >
              Source code
            </a>
          </li>
        </ul>
      </footer>
    </>
  );
}
