import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ILocalizationCommon } from "#lib/localization";

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

export interface ITranslatableProps {
  commonTranslation: ILocalizationCommon
}
