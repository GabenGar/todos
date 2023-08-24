import { type Metadata } from "next";
import Link from "next/link";
import { REPOSITORY_URL, SITE_TITLE } from "#environment";
import { LOCALES } from "#lib/internationalization";
import { ClientProvider } from "#hooks";
import { GlobalNavigation } from "#components";
import type { ReactNode } from "react";
import type { IBasePageParams } from "#pages/types";

import "../../styles/global.scss";

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
          <header>
            <GlobalNavigation />
          </header>
          {children}
          <footer>
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
