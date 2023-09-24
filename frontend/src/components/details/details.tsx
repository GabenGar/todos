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

import styles from "./details.module.scss";

export interface IDetailsProps extends IArticleProps {}
export interface IDetailsHeaderProps extends IArticleHeaderProps {}
export interface IDetailsBodyProps extends IArticleBodyProps {}
export interface IDetailsFooterProps extends IArticleFooterProps {}

export const Details = createBlockComponent(styles, DetailsComponent);
export const DetailsHeader = createBlockComponent(
  styles.header,
  DetailsHeaderComponent,
);
export const DetailsBody = createBlockComponent(
  styles.body,
  DetailsBodyComponent,
);
export const DetailsFooter = createBlockComponent(
  styles.footer,
  ADetailsFooterComponent,
);

function DetailsComponent({ ...props }: IDetailsProps) {
  return <Article {...props} />;
}

function DetailsHeaderComponent({ ...props }: IDetailsHeaderProps) {
  return <ArticleHeader {...props} />;
}

function DetailsBodyComponent({ ...props }: IDetailsBodyProps) {
  return <ArticleBody {...props} />;
}

function ADetailsFooterComponent({ ...props }: IDetailsFooterProps) {
  return <ArticleFooter {...props} />;
}
