import { createBlockComponent } from "#components/meta";
import {
  Article,
  ArticleBody,
  ArticleFooter,
  ArticleHeader,
  type IArticleBodyProps,
  type IArticleFooterProps,
  type IArticleHeaderProps,
  type IArticleProps,
} from "#components/article";

import styles from "./overview.module.scss";

export interface IOverviewProps extends IArticleProps {}
export interface IOverviewHeaderProps extends IArticleHeaderProps {}
export interface IOverviewBodyProps extends IArticleBodyProps {}
export interface IOverviewFooterProps extends IArticleFooterProps {}

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

function OverviewHeaderComponent({ ...props }: IOverviewHeaderProps) {
  return <ArticleHeader {...props} />;
}

function OverviewBodyComponent({ ...props }: IOverviewBodyProps) {
  return <ArticleBody {...props} />;
}

function OverviewFooterComponent({ ...props }: IOverviewFooterProps) {
  return <ArticleFooter {...props} />;
}
