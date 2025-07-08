import type { ReactNode } from "react";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";

import styles from "./details.module.scss";

export interface IDetailsProps
  extends IBaseComponentPropsWithChildren<"details"> {
  summary: ReactNode;
}

export const Details = createBlockComponent(styles, Component);

function Component({ summary, children, ...props }: IDetailsProps) {
  return (
    <details {...props}>
      <summary className={styles.summary}>{summary}</summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
