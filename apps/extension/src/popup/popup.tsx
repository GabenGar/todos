import browser from "webextension-polyfill";
import log from "loglevel";
import { MemoryRouter, Routes, Route } from "react-router";
import { Layout } from "./components/layouts";
import { HomePage } from "./pages/home";

import "@repo/ui/styles/global";

export function Popup() {
  return (
    <MemoryRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
