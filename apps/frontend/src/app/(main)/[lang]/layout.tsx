import type { Metadata } from "next";
import { REPOSITORY_URL, SITE_BASE_URL, SITE_TITLE } from "#environment";
import { LOCALES, validateLocale } from "#lib/internationalization";
import { getDictionary } from "#server";
import { ClientProvider } from "#hooks";
import { GlobalNavigation } from "#components";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";

import "@repo/ui/styles/global";
import styles from "./layout.module.scss";

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  validateLocale(lang)
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

async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  validateLocale(lang)
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
