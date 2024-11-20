import { ReactNode } from "react";
import { createBlockComponent } from "@repo/ui/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";

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
