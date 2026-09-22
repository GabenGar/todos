import type { ComponentPropsWithoutRef, JSX, PropsWithChildren } from "react";

/**
 * Base props for components.
 */
export type IBaseComponentProps<HTMLTag extends keyof JSX.IntrinsicElements> =
  Omit<ComponentPropsWithoutRef<HTMLTag>, "children">;

export type IBaseComponentPropsWithChildren<
  HTMLTag extends keyof JSX.IntrinsicElements,
> = IBaseComponentProps<HTMLTag> & PropsWithChildren;
