import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import OptionsPage from "./components/OptionsPage";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

root.render(
  <StrictMode>
    <OptionsPage />
  </StrictMode>
);
