import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";

import styles from "./article.module.scss";

export interface IArticleProps
  extends IBaseComponentPropsWithChildren<"article"> {}
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

function ArticleComponent({ ...props }: IArticleProps) {
  return <article {...props} />;
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
