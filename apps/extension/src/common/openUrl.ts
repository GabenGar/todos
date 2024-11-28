import browser from "webextension-polyfill";

async function openURL(url: string, isCurrentTab = false) {
  const activeTab = (
    await browser.tabs.query({ currentWindow: true, active: true })
  )[0];

  if (isCurrentTab) {
    browser.tabs.update({ url: url });
  } else {
    browser.tabs.create({ url: url, index: activeTab.index + 1 });
  }
}

export default openURL;
