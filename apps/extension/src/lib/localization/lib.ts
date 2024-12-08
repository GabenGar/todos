import browser from "webextension-polyfill";
import type { default as messages } from "../../_locales/en/messages.json";
import type { IPredefinedMessage } from "./predefined-messages";

type IMessage = keyof typeof messages | IPredefinedMessage;

export function getLocalizedMessage(message: IMessage) {
  return browser.i18n.getMessage(message);
}

export function getCurrentLocale() {
  return browser.i18n.getUILanguage();
}
