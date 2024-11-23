import React from "react";
import { Route, Routes } from "react-router-dom";
// @ts-expect-error no type info for this
import browserInfo from "browser-info";
import SettingsPage from "./SettingsPage";
import KeyboardShortcutsPage from "./KeyboardShortcutsPage";
import InformationPage from "./InformationPage";

import "./ContentsArea.scss";

const isValidShortcuts =
  browserInfo().name == "Firefox" && browserInfo().version >= 60;

export default () => (
  <div className="contentsArea">
    <Routes>
      <Route path="/settings" Component={SettingsPage} />
      {isValidShortcuts && (
        <Route path="/shortcuts" Component={KeyboardShortcutsPage} />
      )}
      <Route path="/information" Component={InformationPage} />
      <Route Component={SettingsPage} />
    </Routes>
  </div>
);
