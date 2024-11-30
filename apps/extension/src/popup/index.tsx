import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Popup } from "./popup";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Popup />
  </StrictMode>
);
