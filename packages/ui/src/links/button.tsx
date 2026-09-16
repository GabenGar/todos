import { createBlockComponent } from "#meta";
import { type ILinkProps, Link } from "./link";
//

import styles from "./button.module.scss";

export type ILinkButtonProps = ILinkProps

export const LinkButton = createBlockComponent(styles.block, Component);

function Component({ children, ...blockProps }: ILinkButtonProps) {
  return (
    <Link {...blockProps}>
      <span className={styles.content}>{children}</span>
    </Link>
  );
}
