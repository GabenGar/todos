import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";
import { Button, IButtonProps } from "./button";

import styles from "./menu.module.scss";

interface IMenuButtonsProps extends IBaseComponentPropsWithChildren<"menu"> {}
interface IMenuItemProps
  extends Omit<IBaseComponentPropsWithChildren<"li">, "onClick">,
    Pick<IButtonProps, "onClick" | "disabled" | "viewType"> {}

export const MenuButtons = createBlockComponent(styles, MenuComponent);
export const MenuItem = createBlockComponent(styles.item, ItemComponent);

function MenuComponent({ children, ...props }: IMenuButtonsProps) {
  return <menu {...props}>{children}</menu>;
}

function ItemComponent({
  viewType,
  disabled,
  onClick,
  children,
  ...props
}: IMenuItemProps) {
  return (
    <li {...props}>
      <Button className={styles.button} viewType={viewType} disabled={disabled} onClick={onClick}>
        {children}
      </Button>
    </li>
  );
}
