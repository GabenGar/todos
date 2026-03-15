import type { ComponentPropsWithoutRef, JSX, ReactNode } from "react";
import type { ILocale } from "#lib/internationalization";

/**
 * Base props for components.
 */
export type IBaseComponentProps<HTMLTag extends keyof JSX.IntrinsicElements> =
  Omit<ComponentPropsWithoutRef<HTMLTag>, "children">;

export type IBaseComponentPropsWithChildren<
  HTMLTag extends keyof JSX.IntrinsicElements,
> = IBaseComponentProps<HTMLTag> & {
  children?: ReactNode;
};

export interface ILocalizableProps {
  language: ILocale;
}
