import type { ComponentPropsWithoutRef, ReactNode, JSX } from "react";
import type { ILocalizationCommon } from "#lib/localization";
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

export interface ITranslatableProps {
  commonTranslation: ILocalizationCommon;
}

export interface ILocalizableProps {
  language: ILocale;
}
