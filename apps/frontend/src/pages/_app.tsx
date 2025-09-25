import type { AppProps } from "next/app";

import "@repo/ui/styles/global";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
