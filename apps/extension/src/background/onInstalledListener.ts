import browser, { type Runtime } from "webextension-polyfill";
import log from "loglevel";
import { initSettings, getSettings, setSettings } from "../settings/settings";
import { initShortcuts } from "./keyboardShortcuts";
import {
  RESULT_FONT_COLOR_LIGHT,
  RESULT_FONT_COLOR_DARK,
  CANDIDATE_FONT_COLOR_LIGHT,
  CANDIDATE_FONT_COLOR_DARK,
  BG_COLOR_LIGHT,
  BG_COLOR_DARK,
} from "../settings/defaultColors";
const logDir = "background/onInstalledListener";

const openOptionsPage = (active: boolean) => {
  browser.tabs.create({
    url: "options/index.html#information?action=updated",
    active: active,
  });
};

async function onInstalledListener(details: Runtime.OnInstalledDetailsType) {
  if (details.reason != "install" && details.reason != "update") {
    return;
  }
  log.info(logDir, "onInstalledListener()", details);

  await initSettings();
  initShortcuts();

  const isShowOptionsPage = getSettings("isShowOptionsPageWhenUpdated");
  if (isShowOptionsPage) openOptionsPage(false);

  // Version 2.8.0以前からのアップデート
  if (
    details.reason == "update" &&
    Number(details.previousVersion.replaceAll(".", "")) < 280
  ) {
    //ユーザーが独自の色を設定していた場合、色の置き換えを有効にする
    const isSetUserColor =
      (getSettings("resultFontColor") !== RESULT_FONT_COLOR_LIGHT &&
        getSettings("resultFontColor") !== RESULT_FONT_COLOR_DARK) ||
      (getSettings("candidateFontColor") !== CANDIDATE_FONT_COLOR_LIGHT &&
        getSettings("candidateFontColor") !== CANDIDATE_FONT_COLOR_DARK) ||
      (getSettings("bgColor") !== BG_COLOR_LIGHT &&
        getSettings("bgColor") !== BG_COLOR_DARK);

    if (isSetUserColor) {
      setSettings("isOverrideColors", true);
    }
  }
}

export default onInstalledListener;
