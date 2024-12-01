import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import { Layout } from "./components/layouts";
import { HomePage } from "./pages/home";

const rootID = "root";
const rootElement = document.getElementById(rootID);

if (!rootElement) {
  throw new Error(`No root element exists for ID "${rootID}".`);
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>
);
