import { type ReactNode } from "react";
import { createBlockComponent } from "#components/meta";
import { validateHeadinglevel, type IHeadingLevel } from "#components/heading";
import type {
  IBaseComponentProps,
  IBaseComponentPropsWithChildren,
} from "#components/types";

import styles from "./article.module.scss";

export interface IArticleProps extends IBaseComponentProps<"article"> {
  headingLevel: IHeadingLevel;
  children?: (headingLevel: IHeadingLevel) => ReactNode;
}
interface IArticleHeaderProps
  extends IBaseComponentPropsWithChildren<"header"> {}
interface IArticleBodyProps
  extends IBaseComponentPropsWithChildren<"section"> {}
interface IArticleFooterProps
  extends IBaseComponentPropsWithChildren<"footer"> {}

export const Article = createBlockComponent(styles, ArticleComponent);
export const ArticleHeader = createBlockComponent(
  styles.header,
  ArticleHeaderComponent,
);
export const ArticleBody = createBlockComponent(
  styles.body,
  ArticleBodyComponent,
);
export const ArticleFooter = createBlockComponent(
  styles.footer,
  ArticleFooterComponent,
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
