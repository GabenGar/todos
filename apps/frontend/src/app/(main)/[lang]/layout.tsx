import type { ReactNode } from "react";
import { type Metadata } from "next";
import { REPOSITORY_URL, SITE_ORIGIN, SITE_TITLE } from "#environment";
import { LOCALES } from "#lib/internationalization";
import { getDictionary } from "#server";
import { ClientProvider } from "#hooks";
import { GlobalNavigation } from "#components";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import type { IBasePageParams } from "#pages/types";

import "@repo/ui/styles/global";
import styles from "./layout.module.scss";

interface IProps {
  children: ReactNode;
  params: IBasePageParams;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { layout } = dict;

  const metadata: Metadata = {
    metadataBase: new URL(SITE_ORIGIN),
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

async function RootLayout({ children, params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { layout } = dict;

  return (
    <html lang={lang}>
      <body>
        <ClientProvider>
          <header className={styles.header}>
            <GlobalNavigation language={lang} />
          </header>

          <main className={styles.main}>{children}</main>

          <footer className={styles.footer}>
            <List className={styles.list}>
              <ListItem>
                <Link href={REPOSITORY_URL}>{layout.source_code}</Link>
              </ListItem>
            </List>
          </footer>
        </ClientProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  const params = LOCALES.map((locale) => {
    return { lang: locale };
  });

  return params;
}

export default RootLayout;
