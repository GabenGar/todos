import "@repo/ui/styles/global/nextjs/pages";

import { ClientProvider } from "#hooks";
import { MainLayout, type AppPropsWithLayout } from "#components/pages/layouts";

function App({ Component, pageProps }: AppPropsWithLayout) {
  if (!Component.getLayout) {
    const { lang, common } = pageProps.translation;

    return (
      <ClientProvider lang={lang}>
        <MainLayout lang={lang} common={common}>
          <Component {...pageProps} />
        </MainLayout>
      </ClientProvider>
    );
  }

  return Component.getLayout(<Component {...pageProps} />);
}

export default App;
