import { createBlockComponent } from "#meta";
import { type ILinkProps, Link } from "./link";
//

import styles from "./button.module.scss";

export const LinkButton = createBlockComponent(styles.block, Component);

function Component({ children, ...blockProps }: ILinkProps) {
  return (
    <Link {...blockProps}>
      <span className={styles.content}>{children}</span>
    </Link>
  );
}
