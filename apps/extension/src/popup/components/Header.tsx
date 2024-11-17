import React from "react";
import browser from "webextension-polyfill";
import openUrl from "../../common/openUrl";
import SettingsIcon from "../icons/settings.svg";
import Toggle, { ToggleProps }  from "react-toggle";

import "react-toggle/style.css";
import "./Header.scss";

interface IProps {
  isEnabledOnPage: boolean
  isConnected: boolean
  toggleEnabledOnPage: ToggleProps["onChange"]
}

function Header({ isEnabledOnPage, isConnected, toggleEnabledOnPage }: IProps) {
  return (
    <div id="header">
      <div className="title">Simple Translate</div>
      <div className="rightButtons">
        <div
          className="toggleButton"
          title={getToggleButtonTitle(isEnabledOnPage)}
        >
          <Toggle
            checked={isEnabledOnPage}
            onChange={toggleEnabledOnPage}
            icons={false}
            disabled={!isConnected}
          />
        </div>
        <button
          className={"settingsButton"}
          onClick={openSettings}
          title={browser.i18n.getMessage("settingsLabel")}
        >
          <SettingsIcon />
        </button>
      </div>
    </div>
  );
}

function getToggleButtonTitle(isEnabled: boolean) {
  return isEnabled
    ? browser.i18n.getMessage("disableOnThisPage")
    : browser.i18n.getMessage("enableOnThisPage");
}

function openSettings() {
  const url = "../options/index.html#settings";
  openUrl(url);
}

export default Header;
