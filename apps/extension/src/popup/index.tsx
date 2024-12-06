import "webextension-polyfill";
import "@repo/ui/styles/global/extension/popup";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import log from "loglevel";
import { MemoryRouter, Routes, Route } from "react-router";
import { Layout } from "#popup/components/layouts";
import { HomePage } from "#popup/pages/home";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <MemoryRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  </StrictMode>
);
