import clsx from "clsx";
import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";

import styles from "./pre.module.scss";

export interface IPreProps extends IBaseComponentPropsWithChildren<"pre"> {
  isCode?: boolean;
}

export const Pre = createBlockComponent(styles, Component);

function Component({ isCode, className, ...props }: IPreProps) {
  return <pre className={clsx(className, isCode && styles.code)} {...props} />;
}
