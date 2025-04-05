import clsx from "clsx";
import { NavLink, type NavLinkProps, type To } from "react-router";

import styles from "./internal.module.scss";

export interface ILinkInternalProps extends Omit<NavLinkProps, "to"> {
  href: To;
}

export function LinkInternal({
  href,
  className,
  ...props
}: ILinkInternalProps) {
  return (
    <NavLink
      to={href}
      className={(props) =>
        clsx(
          styles.block,
          className &&
            (typeof className === "string" ? className : className(props))
        )
      }
      {...props}
    />
  );
}
