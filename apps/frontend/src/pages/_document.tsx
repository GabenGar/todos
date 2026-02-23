import { Head, Html, Main, NextScript } from "next/document";
import { SITE_BASE_PATHNAME } from "#environment";
import { DEFAULT_LOCALE } from "#lib/internationalization";

const manifestURL = `${SITE_BASE_PATHNAME}/manifest.json`;

function Document() {
  return (
    <Html lang={DEFAULT_LOCALE} prefix="og: https://ogp.me/ns#">
      <Head>
        <link rel="manifest" href={manifestURL} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
export default Document;
