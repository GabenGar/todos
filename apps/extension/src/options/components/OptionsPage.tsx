import React from "react";
import browser from "webextension-polyfill";
import { HashRouter } from "react-router-dom";
import { initSettings, getSettings } from "../../settings/settings";
import SideBar from "./SideBar";
import ContentsArea from "./ContentsArea";
import ScrollToTop from "./ScrollToTop";

import "./OptionsPage.scss";

const UILanguage = browser.i18n.getUILanguage();
const isRTLLanguage = ["he", "ar"].includes(UILanguage);
const optionsPageClassName =
  "optionsPage" + (isRTLLanguage ? " rtl-language" : "");

function OptionsPage() {
  setupTheme();

  return (
    <HashRouter>
      <ScrollToTop>
        <div className={optionsPageClassName}>
          <SideBar />
          <ContentsArea />
        </div>
      </ScrollToTop>
    </HashRouter>
  );
}

async function setupTheme() {
  await initSettings();
  document.body.classList.add(getSettings("theme") + "-theme");

  browser.storage.local.onChanged.addListener((changes) => {
    const settings = changes.Settings;
    // @ts-expect-error bizzare storage typing
    const newTheme = settings.newValue.theme;
    // @ts-expect-error bizzare storage typing
    const oldTheme = settings.oldValue.theme;

    if (newTheme === oldTheme) {
      return;
    }

    document.body.classList.replace(
      // @ts-expect-error bizzare storage typing
      `${changes.Settings.oldValue.theme}-theme`,
      // @ts-expect-error bizzare storage typing
      `${changes.Settings.newValue.theme}-theme`
    );
  });
}

export default OptionsPage;
