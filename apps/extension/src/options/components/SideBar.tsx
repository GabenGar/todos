import React from "react";
import browser from "webextension-polyfill";
import { Link, useLocation } from "react-router-dom";
// @ts-expect-error no types for this one
import browserInfo from "browser-info";
import clsx from "clsx";

import "./SideBar.scss";

function SideBar() {
  const location = useLocation();

  return (
    <div className="sideBar">
      <div className="titleContainer">
        <img src="/icons/logo/64.png" className="logo" />
        <span className="logoTitle">Link Overwatch</span>
      </div>

      <ul>
        <li
          className={clsx(
            "sideBarItem",
            ["/shortcuts", "/information"].every(
              (path) => path != location.pathname
            ) && "selected"
          )}
        >
          <Link to="/settings">{browser.i18n.getMessage("settingsLabel")}</Link>
        </li>

        {isValidShortcuts && (
          <li
            className={`sideBarItem ${
              location.pathname == "/shortcuts" ? "selected" : ""
            }`}
          >
            <Link to="/shortcuts">
              {browser.i18n.getMessage("shortcutsLabel")}
            </Link>
          </li>
        )}

        <li
          className={`sideBarItem ${
            location.pathname == "/information" ? "selected" : ""
          }`}
        >
          <Link to="/information">
            {browser.i18n.getMessage("informationLabel")}
          </Link>
        </li>
      </ul>
    </div>
  );
}

function isValidShortcuts() {
  return browserInfo().name == "Firefox" && browserInfo().version >= 60;
}

export default SideBar;
