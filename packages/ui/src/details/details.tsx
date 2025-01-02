import type { ReactNode } from "react";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";

import styles from "./details.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"details"> {
  summary: ReactNode;
}

export const Details = createBlockComponent(styles, Component);

function Component({ summary, children, ...props }: IProps) {
  return (
    <details {...props}>
      <summary className={styles.summary}>{summary}</summary>
      {children}
    </details>
  );
}
