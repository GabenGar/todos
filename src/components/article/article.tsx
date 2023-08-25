import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";

import styles from "./article.module.scss";

interface IArticleProps extends IBaseComponentPropsWithChildren<"article"> {}
interface IArticleHeaderProps
  extends IBaseComponentPropsWithChildren<"header"> {}
interface IArticleBodyProps
  extends IBaseComponentPropsWithChildren<"section"> {}
interface IArticleFooterProps
  extends IBaseComponentPropsWithChildren<"footer"> {}

export const Article = createBlockComponent(styles, ArticleComponent);
export const ArticleHeader = createBlockComponent(styles.header, ArticleHeaderComponent);
export const ArticleBody = createBlockComponent(styles.body, ArticleBodyComponent);
export const ArticleFooter = createBlockComponent(styles.footer, ArticleFooterComponent);

function ArticleComponent({ ...props }: IArticleProps) {
  return <article {...props} />;
}

function ArticleHeaderComponent({
  children,
  ...blockProps
}: IArticleHeaderProps) {
  return <header {...blockProps}>{children}</header>;
}

function ArticleBodyComponent({ children, ...blockProps }: IArticleBodyProps) {
  return <section {...blockProps}>{children}</section>;
}

function ArticleFooterComponent({
  children,
  ...blockProps
}: IArticleFooterProps) {
  return <footer {...blockProps}>{children}</footer>;
}
