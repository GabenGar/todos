import "@repo/ui/styles/global/nextjs/pages";

import { ClientProvider, ServiceWorkerProvider } from "#hooks";
import { MainLayout, type AppPropsWithLayout } from "#components/pages/layouts";

function App({ Component, pageProps }: AppPropsWithLayout) {
  if (!Component.getLayout) {
    const { lang, common } = pageProps.translation;

    return (
      <ServiceWorkerProvider>
        <ClientProvider lang={lang}>
          <MainLayout lang={lang} common={common}>
            <Component {...pageProps} />
          </MainLayout>
        </ClientProvider>
      </ServiceWorkerProvider>
    );
  }

  return (
    <ServiceWorkerProvider>
      {Component.getLayout(<Component {...pageProps} />)}
    </ServiceWorkerProvider>
  );
}

export default App;
