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
import { SITE_TITLE } from "#environment";
import { ClientProvider } from "#hooks";

function RootComponent() {
  return (
    <RootDocument>
      <ClientProvider>
        <Outlet />
      </ClientProvider>
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

export const Route = createRootRoute({
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
