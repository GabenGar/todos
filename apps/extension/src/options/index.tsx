import "@repo/ui/styles/global/extension/options";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "./routes";

const rootID = "root";
const rootElement = document.getElementById(rootID);

if (!rootElement) {
  throw new Error(`No root element exists for ID "${rootID}".`);
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
