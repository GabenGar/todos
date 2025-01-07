import browser from "webextension-polyfill";
import { getSetting } from "#lib/settings";

browser.tabs.onActivated.addListener(async ({ tabId }) => {
  const isPageActionEnabled = await getSetting("page_action");

  if (!isPageActionEnabled) {
    return;
  }

  await browser.pageAction.show(tabId);
});
