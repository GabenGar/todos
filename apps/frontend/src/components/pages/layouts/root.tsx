import type { ReactNode } from "react";

import styles from "./root.module.scss";

interface IProps {
  children: ReactNode;
}

export function RootLayout({ children }: IProps) {
  return (
    <>
      <main className={styles.main}>{children}</main>
    </>
  );
}
