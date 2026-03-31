import { createFileRoute, Outlet } from "@tanstack/react-router";
//

import styles from "./_base.module.scss";

function LanguageSelectLayout() {
  return (
    <main className={styles.main}>
      <Outlet />
    </main>
  );
}

export const Route = createFileRoute("/_base")({
  component: LanguageSelectLayout,
});
