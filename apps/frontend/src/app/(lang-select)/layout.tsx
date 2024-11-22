import type { ReactNode } from "react";
import { type Metadata } from "next";
import { SITE_BASE_URL, SITE_TITLE } from "#environment";

import "@repo/ui/styles/global";
import styles from "./layout.module.scss";

interface IProps {
  children: ReactNode;
}

export async function generateMetadata({}: IProps): Promise<Metadata> {
  const metadata: Metadata = {
    metadataBase: new URL(SITE_BASE_URL),
    title: { template: `%s | ${SITE_TITLE}`, default: SITE_TITLE },
    generator: "Next.js",
    openGraph: {
      type: "website",
      title: SITE_TITLE,
    },
  };

  return metadata;
}

async function RootLayout({ children }: IProps) {
  return (
    <html>
      <body>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}

export default RootLayout;
