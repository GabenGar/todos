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
  return (
    <header className={styles.header} {...blockProps}>
      {children}
    </header>
  );
}

export function ArticleBody({ children, ...blockProps }: IArticleBodyProps) {
  return (
    <section className={styles.body} {...blockProps}>
      {children}
    </section>
  );
}

export function ArticleFooter({
  children,
  ...blockProps
}: IArticleFooterProps) {
  return (
    <footer className={styles.footer} {...blockProps}>
      {children}
    </footer>
  );
}
