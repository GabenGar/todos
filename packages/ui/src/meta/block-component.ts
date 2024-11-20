import clsx from "clsx";

export type IFuncComponent<PropsType> = (
  props: PropsType,
  // biome-ignore lint/suspicious/noExplicitAny: refs are annoying
  ref?: any,
) => JSX.Element;

interface IBaseProps {
  className?: string;
}

interface IBlockStyles {
  block?: string;
}

/**
 * Concatenates `className` of the component with the `className`
 * of the props passed to it, so it could be passed with `{...props}` call.
 * @param blockClassName
 * Either a `className` string or a `styles` object module.
 * The `styles` object always assumes the presence of the `.block` style.
 *
 * @example
 * Without decorator:
 * ```tsx
 * import type { ComponentPropsWithoutRef } from "react";
 *
 * import styles from "./base.module.scss";
 *
 * interface IProps extends ComponentPropsWithoutRef<"button"> {}
 *
 * export function Button({ className, ...props }: IProps) {
 *   return <button className={`${styles.block} ${className}`} {...props} />;
 * }
 * ```
 * @example
 * With decorator:
 * ```tsx
 * import type { ComponentPropsWithoutRef } from "react";
 * import { createBlockComponent } from "@repo/ui/meta";
 *
 * import styles from "./base.module.scss";
 *
 * interface IProps extends ComponentPropsWithoutRef<"button"> {}
 *
 * export const Button = createBlockComponent(styles, Component);
 *
 * function Component({ ...props }: IProps) {
 *   return <button {...props} />;
 * }
 * ```
 */
export function createBlockComponent<Props extends IBaseProps = IBaseProps>(
  blockClassName: IBlockStyles | string | undefined,
  functionComponent: IFuncComponent<Props>,
): typeof functionComponent {
  return (...args: Parameters<typeof functionComponent>) => {
    const [props, ref] = args;
    const baseClassName =
      typeof blockClassName === "string"
        ? blockClassName
        : blockClassName?.block;
    const className = clsx(baseClassName, props.className);

    return functionComponent({ ...props, className }, ref);
  };
}
