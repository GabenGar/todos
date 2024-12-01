import browser from "webextension-polyfill";
import { Outlet } from "react-router";
import { Button } from "@repo/ui/buttons"

import styles from "./layout.module.scss";

export function Layout() {
  return (
    <>
      <header className={styles.header}>
        <nav>
          <ul>
            <li>Link overwatch</li>
            <li>
              <Button
                onClick={() => browser.runtime.openOptionsPage()}
              >
                Options
              </Button>
            </li>
          </ul>
        </nav>
      </header>

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
