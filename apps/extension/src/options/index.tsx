import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import { RouterConfig } from "./routes";

const rootID = "root";
const rootElement = document.getElementById(rootID);

if (!rootElement) {
  throw new Error(`No root element exists for ID "${rootID}".`);
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <HashRouter>
      <RouterConfig />
    </HashRouter>
  </StrictMode>
);
