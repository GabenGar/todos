import type { ReactNode } from "react";
import { type Metadata } from "next";
import { REPOSITORY_URL, SITE_ORIGIN, SITE_TITLE } from "#environment";
import { LOCALES } from "#lib/internationalization";
import { getDictionary } from "#server";
import { ClientProvider } from "#hooks";
import { GlobalNavigation } from "#components";
import type { IBasePageParams } from "#pages/types";

import "../../styles/global.scss";
import styles from "./layout.module.scss";

interface IProps {
  children: ReactNode;
  params: IBasePageParams;
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { template: `%s | ${SITE_TITLE}`, default: SITE_TITLE },
  description: "Site built with NextJS.",
  openGraph: {
    title: SITE_TITLE,
    description: "Site built with NextJS.",
  },
};

async function RootLayout({ children, params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { layout } = dict

  return (
    <html lang={lang}>
      <body>
        <ClientProvider>
          <header className={styles.header}>
            <GlobalNavigation />
          </header>
          <main className={styles.main}>{children}</main>
          <footer className={styles.footer}>
            <a href={REPOSITORY_URL}>{layout.source_code}</a>
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
