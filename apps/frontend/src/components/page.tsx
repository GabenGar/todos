import type { ReactNode } from "react";
import Head from "next/head";
import { createBlockComponent } from "@repo/ui/meta";
import { SITE_TITLE } from "#environment";
import { Heading } from "./heading";
import type { IBaseComponentPropsWithChildren } from "./types";

import styles from "./page.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"section"> {
  title?: string;
  heading?: ReactNode;
  description?: string;
  type?: "website";
  imageURL?: string;
  canonicalURL?: string;
}

export const Page = createBlockComponent(styles, Component);

function Component({
  title,
  heading,
  description,
  type = "website",
  imageURL,
  canonicalURL,
  children,
  ...props
}: IProps) {
  const finalTitle = !title ? SITE_TITLE : `${title} | ${SITE_TITLE}`;

  return (
    <>
      <Head>
        <title>{finalTitle}</title>

        {description && (
          <meta
            key="description"
            property="description"
            content={description}
          />
        )}

        <meta key="og:type" property="og:type" content={type} />
        <meta key="og:site_name" property="og:site_name" content={SITE_TITLE} />
        <meta key="og:title" property="og:title" content={finalTitle} />

        <meta
          key="og:image"
          property="og:image"
          content={imageURL ?? "/next.svg"}
        />

        {canonicalURL && (
          <meta
            key="og:url"
            property="og:url"
            content={imageURL ?? "/next.svg"}
          />
        )}
      </Head>

      {heading && <Heading level={1}>{heading}</Heading>}

      <section {...props}>{children}</section>
    </>
  );
}
