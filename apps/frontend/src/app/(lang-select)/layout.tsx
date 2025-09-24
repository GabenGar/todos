import type { Metadata } from "next";
import { SITE_BASE_URL, SITE_TITLE } from "#environment";

import "@repo/ui/styles/global";
import styles from "./layout.module.scss";

export async function generateMetadata(): Promise<Metadata> {
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

async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html>
      <body>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}

export default RootLayout;
