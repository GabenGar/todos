import browser from "webextension-polyfill";

export async function getCurrentTab() {
  const results = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (results.length === 0) {
    throw new Error("Failed to find current tab.");
  }

  if (results.length !== 1) {
    throw new Error("Found more than two current tabs.");
  }

  return results[0];
}

export async function getCurrentTabID() {
  const tab = await getCurrentTab();

  if (!tab.id) {
    throw new Error("Failed to find ID of the current tab.");
  }

  return tab.id;
}
