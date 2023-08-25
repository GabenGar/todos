import { type Metadata } from "next";
import { REPOSITORY_URL, SITE_TITLE } from "#environment";
import { LOCALES } from "#lib/internationalization";
import { ClientProvider } from "#hooks";
import { GlobalNavigation } from "#components";
import type { ReactNode } from "react";
import type { IBasePageParams } from "#pages/types";

import "../../styles/global.scss";
import styles from "./layout.module.scss";

interface IProps {
  children: ReactNode;
  params: IBasePageParams;
}

export const metadata: Metadata = {
  title: { template: `%s | ${SITE_TITLE}`, default: SITE_TITLE },
  description: "Site built with NextJS.",
  openGraph: {
    title: SITE_TITLE,
    description: "Site built with NextJS.",
  },
};

function RootLayout({ children, params }: IProps) {
  const { lang } = params;

  return (
    <html lang={lang}>
      <body>
        <ClientProvider>
          <header className={styles.header}>
            <GlobalNavigation />
          </header>
          <main className={styles.main}>{children}</main>
          <footer className={styles.footer}>
            <a href={REPOSITORY_URL}>Repository</a>
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
