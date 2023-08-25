import type { IBaseComponentPropsWithChildren } from "#components/types";

import styles from "./article.module.scss";

interface IArticleProps extends IBaseComponentPropsWithChildren<"article"> {}
interface IArticleHeaderProps
  extends IBaseComponentPropsWithChildren<"header"> {}
interface IArticleBodyProps
  extends IBaseComponentPropsWithChildren<"section"> {}
interface IArticleFooterProps
  extends IBaseComponentPropsWithChildren<"footer"> {}

export function Article({ children, ...blockProps }: IArticleProps) {
  return (
    <article className={styles.block} {...blockProps}>
      {children}
    </article>
  );
}

export function ArticleHeader({
  children,
  ...blockProps
}: IArticleHeaderProps) {
  return <header {...blockProps}>{children}</header>;
}

export function ArticleBody({ children, ...blockProps }: IArticleBodyProps) {
  return <section {...blockProps}>{children}</section>;
}

export function ArticleFooter({
  children,
  ...blockProps
}: IArticleFooterProps) {
  return <footer {...blockProps}>{children}</footer>;
}
