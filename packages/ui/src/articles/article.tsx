import type { ReactNode } from "react";
import {
  createBlockComponent,
  type IBaseComponentProps,
  type IBaseComponentPropsWithChildren,
} from "#meta";
import { validateHeadinglevel, type IHeadingLevel } from "#headings";

export interface IArticleProps extends IBaseComponentProps<"article"> {
  headingLevel: IHeadingLevel;
  children?: (headingLevel: IHeadingLevel) => ReactNode;
}
export interface IArticleHeaderProps
  extends IBaseComponentPropsWithChildren<"header"> {}
export interface IArticleBodyProps
  extends IBaseComponentPropsWithChildren<"section"> {}
export interface IArticleFooterProps
  extends IBaseComponentPropsWithChildren<"footer"> {}

export const Article = createBlockComponent(undefined, ArticleComponent);
export const ArticleHeader = createBlockComponent(
  undefined,
  ArticleHeaderComponent
);
export const ArticleBody = createBlockComponent(
  undefined,
  ArticleBodyComponent
);
export const ArticleFooter = createBlockComponent(
  undefined,
  ArticleFooterComponent
);

function ArticleComponent({ headingLevel, children, ...props }: IArticleProps) {
  validateHeadinglevel(headingLevel);

  return <article {...props}>{children?.(headingLevel)}</article>;
}

function ArticleHeaderComponent({ ...props }: IArticleHeaderProps) {
  return <header {...props} />;
}

function ArticleBodyComponent({ ...props }: IArticleBodyProps) {
  return <section {...props} />;
}

function ArticleFooterComponent({ ...props }: IArticleFooterProps) {
  return <footer {...props} />;
}
