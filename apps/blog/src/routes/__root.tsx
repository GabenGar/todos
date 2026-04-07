/// <reference types="vite/client" />
import "@repo/ui/styles/global";
//

import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { Resource } from "i18next";
import type { ReactNode } from "react";
import { useSSR } from "react-i18next";
import { DEFAULT_LANGUAGE, IS_BROWSER, SITE_TITLE } from "#environment";
import { ClientProvider } from "#hooks";
import {
  getTranslation,
  type ILocale,
  initClientTranslation,
} from "#translation/lib";

interface IRootContext {
  language: ILocale;
  translation: Resource;
}

function RootComponent() {
  const { language, translation } = Route.useRouteContext();

  if (IS_BROWSER) {
    initClientTranslation(language, translation);
  }

  useSSR(translation, language);

  return (
    <RootDocument>
      <ClientProvider serverLanguage={language}>
        <Outlet />
      </ClientProvider>
    </RootDocument>
  );
}

interface IRootDocumentProps {
  children: ReactNode;
}

function RootDocument({ children }: Readonly<IRootDocumentProps>) {
  const { language } = Route.useRouteContext();

  return (
    <html lang={language}>
      <head>
        <HeadContent />
      </head>

      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export const Route = createRootRouteWithContext<IRootContext>()({
  beforeLoad: async ({ params }) => {
    const language = (params["language"] as ILocale) ?? DEFAULT_LANGUAGE;
    const translation = await getTranslation(language);

    return {
      language,
      translation,
    };
  },
  head: async () => {
    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: SITE_TITLE,
        },
      ],
    };
  },
  component: RootComponent,
});
