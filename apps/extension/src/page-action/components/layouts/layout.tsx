import { Outlet, ScrollRestoration } from "react-router";
import { ClientProvider } from "#popup/hooks";

import styles from "./layout.module.scss";

export function Layout() {
  return (
    <ClientProvider>
      <main className={styles.main}>
        <Outlet />
      </main>

      <ScrollRestoration />
    </ClientProvider>
  );
}
