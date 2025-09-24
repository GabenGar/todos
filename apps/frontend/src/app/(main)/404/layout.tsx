import type { Metadata } from "next";
import { SITE_BASE_URL, SITE_TITLE } from "#environment";
import { DEFAULT_LOCALE } from "#lib/internationalization";
import { getDictionary } from "#server";

import "@repo/ui/styles/global";
import styles from "./layout.module.scss";

export async function generateMetadata(): Promise<Metadata> {
  const lang = DEFAULT_LOCALE;
  const dict = await getDictionary(lang);
  const { layout } = dict;

  const metadata: Metadata = {
    metadataBase: new URL(SITE_BASE_URL),
    title: { template: `%s | ${SITE_TITLE}`, default: SITE_TITLE },
    description: layout.description,
    generator: "Next.js",
    openGraph: {
      type: "website",
      locale: lang,
      title: SITE_TITLE,
      description: layout.description,
    },
  };

  return metadata;
}

async function RootLayout({ children }: LayoutProps<"/404">) {
  const lang = DEFAULT_LOCALE;

  return (
    <html lang={lang}>
      <body>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}

export default RootLayout;
