/// <reference types="vite/client" />
import "@repo/ui/styles/global";
//

import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useSSR, useTranslation } from "react-i18next";
import { LanguageSelectLayout } from "#components/layouts";
import { SITE_TITLE } from "#environment";

export const Route = createRootRoute({
  head: () => ({
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
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <LanguageSelectLayout>
        <Outlet />
      </LanguageSelectLayout>
    </RootDocument>
  );
}

interface IRootDocumentProps {
  children: ReactNode;
}

function RootDocument({ children }: Readonly<IRootDocumentProps>) {
  return (
    <html>
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
