import "@repo/ui/styles/global/nextjs/pages";

//
import { useSSR } from "react-i18next";
import { ErrorBoundary } from "#components/errors";
import { type AppPropsWithLayout, MainLayout } from "#components/pages/layouts";
import { IS_BROWSER } from "#environment";
import { ClientProvider, ServiceWorkerProvider } from "#hooks";
import { initClientTranslation } from "#lib/internationalization";

function App({ Component, pageProps, ...appProps }: AppPropsWithLayout) {
  if (!Component.getLayout) {
    return (
      <TranslatedApp
        Component={Component}
        pageProps={pageProps}
        {...appProps}
      />
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

function TranslatedApp({ Component, pageProps }: AppPropsWithLayout) {
  const { translation, lang } = pageProps;

  if (IS_BROWSER) {
    initClientTranslation(lang, translation);
  }

  useSSR(translation, lang);

  return (
    <ErrorBoundary>
      <ServiceWorkerProvider>
        <ClientProvider lang={lang}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </ClientProvider>
      </ServiceWorkerProvider>
    </ErrorBoundary>
  );
}

export default App;
