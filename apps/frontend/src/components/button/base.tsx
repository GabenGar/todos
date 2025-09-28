import { useState } from "react";
import clsx from "clsx";
import { createBlockComponent } from "@repo/ui/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";
import type { IClickEvent, IViewType } from "./types";

import styles from "./base.module.scss";

export interface IButtonBaseProps
  extends IBaseComponentPropsWithChildren<"button"> {
  /**
   * A type of the view of button.
   * Is not related to `HTMLButtonElement.type`
   * because it only affects the looks and not the behaviour.
   * For cases like a submit button within a nested dependant form -
   * it needs to behave like a submit button, but look like a normal one.
   */
  viewType?: IViewType;
  onClick?: (event: IClickEvent) => Promise<void> | void;
}

export const ButtonBase = createBlockComponent(styles, Component);

function Component({
  className,
  viewType = "button",
  onClick,
  ...props
}: IButtonBaseProps) {
  const [isClicking, switchClicking] = useState(false);
  const blockClass = clsx(
    className,
    styles[viewType],
    isClicking && styles.block_clicking,
  );

  async function handleClick(event: IClickEvent) {
    if (isClicking) {
      return;
    }

    try {
      switchClicking(true);
      onClick && (await onClick(event));
    } finally {
      switchClicking(false);
    }
  }

  return <button className={blockClass} onClick={handleClick} {...props} />;
}
