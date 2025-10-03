import { Html, Head, Main, NextScript } from "next/document";
import { DEFAULT_LOCALE } from "#lib/internationalization";

function Document() {
  return (
    <Html lang={DEFAULT_LOCALE} prefix="og: https://ogp.me/ns#">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
export default Document;
