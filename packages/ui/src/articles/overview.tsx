import clsx from "clsx";
import { createBlockComponent } from "@repo/ui/meta";
import {
  Article,
  ArticleBody,
  ArticleFooter,
  ArticleHeader,
  type IArticleBodyProps,
  type IArticleFooterProps,
  type IArticleHeaderProps,
  type IArticleProps,
} from "./article";

import styles from "./overview.module.scss";

export interface IOverviewProps extends IArticleProps {}
export interface IOverviewHeaderProps extends IArticleHeaderProps {
  isFilled?: boolean;
}
export interface IOverviewBodyProps extends IArticleBodyProps {
  isFilled?: boolean;
}
export interface IOverviewFooterProps extends IArticleFooterProps {
  isFilled?: boolean;
}

export const Overview = createBlockComponent(styles, OverviewComponent);
export const OverviewHeader = createBlockComponent(
  styles.header,
  OverviewHeaderComponent,
);
export const OverviewBody = createBlockComponent(
  styles.body,
  OverviewBodyComponent,
);
export const OverviewFooter = createBlockComponent(
  styles.footer,
  OverviewFooterComponent,
);

function OverviewComponent({ ...props }: IOverviewProps) {
  return <Article {...props} />;
}

function OverviewHeaderComponent({
  isFilled,
  className,
  ...props
}: IOverviewHeaderProps) {
  const resolvedClassname = clsx(className, isFilled && styles.filled);

  return <ArticleHeader className={resolvedClassname} {...props} />;
}

function OverviewBodyComponent({
  isFilled,
  className,
  ...props
}: IOverviewBodyProps) {
  const resolvedClassname = clsx(className, isFilled && styles.filled);

  return <ArticleBody className={resolvedClassname} {...props} />;
}

function OverviewFooterComponent({
  isFilled,
  className,
  ...props
}: IOverviewFooterProps) {
  const resolvedClassname = clsx(className, isFilled && styles.filled);

  return <ArticleFooter className={resolvedClassname} {...props} />;
}
