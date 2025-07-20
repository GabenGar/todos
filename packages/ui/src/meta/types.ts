import type { ComponentPropsWithoutRef, JSX, ReactNode } from "react";

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

export interface ITranslatableProps<TranslationKey extends string> {
  t: (translationKey: TranslationKey) => ReactNode;
}

export interface ITranslationProps<TranslationKey extends string> {
  translation: Record<TranslationKey, string>;
}
