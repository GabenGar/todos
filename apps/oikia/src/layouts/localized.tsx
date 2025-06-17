import { href, Outlet } from "react-router";
import { LinkExternal } from "@repo/ui/links";
import { LinkInternal } from "#components/link";

import "@repo/ui/styles/global";
import styles from "./localized.module.scss";

export function LocalizedLayout() {
  return (
    <>
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
    </>
  );
}

export default LocalizedLayout;
