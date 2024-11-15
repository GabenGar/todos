import React from "react";
import browser from "webextension-polyfill";
import { Link, withRouter } from "react-router-dom";
import browserInfo from "browser-info";

import "./SideBar.scss";

const sideBar = withRouter(function SideBar(props) {
  return (
    <div className="sideBar">
      <div className="titleContainer">
        <img src="/icons/64.png" className="logo" />
        <span className="logoTitle">Simple Translate</span>
      </div>
      <ul>
        <li
          className={`sideBarItem ${
            ["/shortcuts", "/information"].every(
              (path) => path != props.location.pathname
            )
              ? "selected"
              : ""
          }`}
        >
          <Link to="/settings">{browser.i18n.getMessage("settingsLabel")}</Link>
        </li>

        {isValidShortcuts && (
          <li
            className={`sideBarItem ${
              props.location.pathname == "/shortcuts" ? "selected" : ""
            }`}
          >
            <Link to="/shortcuts">
              {browser.i18n.getMessage("shortcutsLabel")}
            </Link>
          </li>
        )}

        <li
          className={`sideBarItem ${
            props.location.pathname == "/information" ? "selected" : ""
          }`}
        >
          <Link to="/information">
            {browser.i18n.getMessage("informationLabel")}
          </Link>
        </li>
      </ul>
    </div>
  );
});

function isValidShortcuts() {
  return browserInfo().name == "Firefox" && browserInfo().version >= 60;
}

export default sideBar;
