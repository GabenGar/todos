import browser from "webextension-polyfill";
import { createMessage, type IMessage } from "#lib/messages";
import { collectSEO } from "./collect-seo";

runContentScript();

async function runContentScript() {
  const metaTags = await collectSEO();

  const message = createMessage("seo", metaTags);

  browser.runtime.onMessage.addListener((message: unknown, sender, sendResponse) => {

  })
    
}
