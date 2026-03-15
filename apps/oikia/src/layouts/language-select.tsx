import { Outlet } from "react-router";
// 

import styles from "./language-select.module.scss";

function LanguageSelectLayout() {
  return (
    <main className={styles.main}>
      <Outlet />
    </main>
  );
}

export default LanguageSelectLayout;
