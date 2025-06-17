import { NavLink } from "react-router";
import clsx from "clsx";
import type { ILinkInternalProps } from "./internal";

import styles from "./button.module.scss";

interface ILinkButtonProps extends ILinkInternalProps {}

export function LinkButton({
  href,
  className,
  children,
  ...blockProps
}: ILinkButtonProps) {
  return (
    <NavLink
      className={(props) =>
        clsx(
          styles.block,
          className &&
            (typeof className === "string" ? className : className(props)),
        )
      }
      to={href}
      {...blockProps}
    >
      {(props) => (
        <span className={styles.content}>
          {typeof children === "function" ? children(props) : children}
        </span>
      )}
    </NavLink>
  );
}
