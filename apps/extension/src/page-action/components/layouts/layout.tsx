import { Outlet } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
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
