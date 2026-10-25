import browser from "webextension-polyfill";
import { createMessage } from "#lib/messages";
import { collectSEO } from "./collect-seo";

runContentScript();

async function runContentScript() {
  const seoResult = await collectSEO();
  const message = createMessage("seo", seoResult);

  await browser.runtime.sendMessage(message);
}
