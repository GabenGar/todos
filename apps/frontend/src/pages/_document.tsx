import { Html, Head, Main, NextScript } from "next/document";
import { DEFAULT_LOCALE } from "#lib/internationalization";
import { SITE_BASE_PATHNAME } from "#environment";

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
