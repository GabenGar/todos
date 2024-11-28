import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PopupPage from "./popup";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <PopupPage />
  </StrictMode>
);
