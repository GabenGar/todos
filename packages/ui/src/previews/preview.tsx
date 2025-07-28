import type { CSSProperties } from "react";
import {
  Article,
  ArticleBody,
  ArticleFooter,
  ArticleHeader,
  type IArticleBodyProps,
  type IArticleFooterProps,
  type IArticleHeaderProps,
  type IArticleProps,
} from "#articles";
import { createBlockComponent } from "#meta";

import styles from "./preview.module.scss";

export interface IPreviewProps extends Omit<IArticleProps, "style"> {
  minHeight?: string;
}
export interface IPreviewHeaderProps extends IArticleHeaderProps {}
export interface IPreviewBodyProps extends IArticleBodyProps {}
export interface IPreviewFooterProps extends IArticleFooterProps {}

export const Preview = createBlockComponent(styles, PreviewComponent);
export const PreviewHeader = createBlockComponent(
  styles.header,
  PreviewHeaderComponent,
);
export const PreviewBody = createBlockComponent(
  styles.body,
  PreviewBodyComponent,
);
export const PreviewFooter = createBlockComponent(
  styles.footer,
  PreviewFooterComponent,
);

function PreviewComponent({ minHeight = "20em", ...props }: IPreviewProps) {
  return (
    <Article
      style={
        {
          "--local-min-height": minHeight,
        } as CSSProperties
      }
      {...props}
    />
  );
}

function PreviewHeaderComponent({ ...props }: IPreviewHeaderProps) {
  return <ArticleHeader {...props} />;
}

function PreviewBodyComponent({ ...props }: IPreviewBodyProps) {
  return <ArticleBody {...props} />;
}

function PreviewFooterComponent({ ...props }: IPreviewFooterProps) {
  return <ArticleFooter {...props} />;
}
