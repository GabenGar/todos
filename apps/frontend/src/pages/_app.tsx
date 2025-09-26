import "@repo/ui/styles/global";

import { MainLayout, type AppPropsWithLayout } from "#components/pages/layouts";

function App({ Component, pageProps }: AppPropsWithLayout) {
  return !Component.getLayout ? (
    <MainLayout>{<Component {...pageProps} />}</MainLayout>
  ) : (
    Component.getLayout(<Component {...pageProps} />)
  );
}

export default App;
