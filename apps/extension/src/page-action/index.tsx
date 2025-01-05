import "webextension-polyfill";
import "@repo/ui/styles/global/extension/popup";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { routes } from "./routes";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(`Root element not foudn at ID "root"`);
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
);
