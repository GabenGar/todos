import browser from "webextension-polyfill";

export async function getActiveTab() {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tabs[0]
}
