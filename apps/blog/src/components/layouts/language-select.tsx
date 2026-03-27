import type { ReactNode } from "react";
// 

import styles from "./language-select.module.scss";

interface IProps {
  children: ReactNode;
}

export function LanguageSelectLayout({ children }: IProps) {
  return <main className={styles.main}>{children}</main>;
}
