import "@repo/ui/styles/global/nextjs/pages";

import { ClientProvider, ServiceWorkerProvider } from "#hooks";
import { MainLayout, type AppPropsWithLayout } from "#components/pages/layouts";
import { ErrorBoundary } from "#components/errors";

function App({ Component, pageProps }: AppPropsWithLayout) {
  if (!Component.getLayout) {
    const { lang, common } = pageProps.translation;

    return (
      <ErrorBoundary>
        <ServiceWorkerProvider>
          <ClientProvider lang={lang}>
            <MainLayout lang={lang} common={common}>
              <Component {...pageProps} />
            </MainLayout>
          </ClientProvider>
        </ServiceWorkerProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ServiceWorkerProvider>
        {Component.getLayout(<Component {...pageProps} />)}
      </ServiceWorkerProvider>
    </ErrorBoundary>
  );
}

export default App;
