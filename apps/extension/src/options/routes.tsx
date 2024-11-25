import { Route, Routes } from "react-router";
import { OptionsPage } from "./pages/options";

export function RouterConfig() {
  return (
    <Routes>
      <Route path="/settings" element={<OptionsPage />} />
    </Routes>
  );
}
