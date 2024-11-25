import browser from "webextension-polyfill";
import { initSettings, getSettings } from "../../settings/settings";
import SideBar from "../components/SideBar";
import ContentsArea from "../components/ContentsArea";

import "./options.scss";

const UILanguage = browser.i18n.getUILanguage();
const isRTLLanguage = ["he", "ar"].includes(UILanguage);
const optionsPageClassName =
  "optionsPage" + (isRTLLanguage ? " rtl-language" : "");

export function OptionsPage() {
  setupTheme();

  return (
    <div className={optionsPageClassName}>
      <SideBar />
      <ContentsArea />
    </div>
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
