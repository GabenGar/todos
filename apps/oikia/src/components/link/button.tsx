import clsx from "clsx";
import styles from "./button.module.scss";
import { type ILinkInternalProps, LinkInternal } from "./internal";

interface ILinkButtonProps extends ILinkInternalProps {}

export function LinkButton({
  href,
  className,
  children,
  ...blockProps
}: ILinkButtonProps) {
  return (
    <LinkInternal
      className={(props) =>
        clsx(
          styles.block,
          className &&
            (typeof className === "string" ? className : className(props)),
        )
      }
      href={href}
      {...blockProps}
    >
      {(props) => (
        <span className={styles.content}>
          {typeof children === "function" ? children(props) : children}
        </span>
      )}
    </LinkInternal>
  );
}
