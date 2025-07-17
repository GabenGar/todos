import clsx from "clsx";
import { NavLink, type NavLinkProps } from "react-router";

import styles from "./internal.module.scss";

export interface ILinkInternalProps extends Omit<NavLinkProps, "to"> {
  href?: string | URL;
}

export function LinkInternal({
  href,
  className,
  ...props
}: ILinkInternalProps) {
  if (!href) {
    return <span className={clsx(styles.block, className)} />;
  }

  return (
    <NavLink
      to={href}
      className={(props) =>
        clsx(
          styles.block,
          className &&
            (typeof className === "string" ? className : className(props)),
        )
      }
      {...props}
    />
  );
}
