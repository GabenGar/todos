import { Outlet } from "react-router";

import "@repo/ui/styles/global";
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
