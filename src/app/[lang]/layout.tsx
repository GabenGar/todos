import { type Metadata } from "next";
import { LOCALES } from "#lib/internationalization";
import { ClientProvider } from "#hooks";
import { GlobalNavigation } from "#components";
import type { ReactNode } from "react";
import type { IBasePageParams } from "#pages/types";

interface IProps {
  children: ReactNode;
  params: IBasePageParams;
}

export const metadata: Metadata = {
  title: "Next.js",
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
          <footer>Repo URL</footer>
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
