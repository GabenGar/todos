import type { IBaseComponentPropsWithChildren } from "#components/types";

import styles from "./label.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"label"> {}

export function Label({ ...props }: IProps) {
  return <label className={styles.block} {...props} />;
}
