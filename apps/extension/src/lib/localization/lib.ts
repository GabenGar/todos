import browser from "webextension-polyfill";
import type { default as messages } from "../../_locales/en/messages.json";
import type { IPredefinedMessage } from "./predefined-messages";

type IMessage = keyof typeof messages | IPredefinedMessage;

export function getLocalizedMessage(message: IMessage, ...substitutions: string[]) {
  return browser.i18n.getMessage(message, substitutions);
}

export function getCurrentLocale() {
  return browser.i18n.getUILanguage();
}
