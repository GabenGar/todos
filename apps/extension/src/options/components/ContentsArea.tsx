import React from "react";
import { Route, Switch } from "react-router-dom";
// @ts-expect-error no type info for this
import browserInfo from "browser-info";
import SettingsPage from "./SettingsPage";
import KeyboardShortcutsPage from "./KeyboardShortcutsPage";
import InformationPage from "./InformationPage";

import "./ContentsArea.scss";

const isValidShortcuts = browserInfo().name == "Firefox" && browserInfo().version >= 60;

export default () => (
  <div className="contentsArea">
    <Switch>
      <Route path="/settings" component={SettingsPage} />
      {isValidShortcuts && <Route path="/shortcuts" component={KeyboardShortcutsPage} />}
      <Route path="/information" component={InformationPage} />
      <Route component={SettingsPage} />
    </Switch>
  </div>
);