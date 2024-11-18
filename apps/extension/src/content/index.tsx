import React from "react";
import ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import {
  initSettings,
  getSettings,
  handleSettingsChange,
} from "../settings/settings";
import { updateLogLevel, overWriteLogLevel } from "../common/log";
import TranslateContainer from "./components/TranslateContainer";

interface IPosition {
  x: number;
  y: number;
}

init();

let prevSelectedText = "";

async function init() {
  await initSettings();
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  browser.storage.local.onChanged.addListener(handleSettingsChange);
  browser.runtime.onMessage.addListener(handleMessage);
  overWriteLogLevel();
  updateLogLevel();
  disableExtensionByUrlList();
}

async function handleMouseUp(event: MouseEvent) {
  await waitTime(10);

  const isLeftClick = event.button === 0;

  if (!isLeftClick) {
    return;
  }

  const element = event.target as HTMLElement;
  const isInPasswordField =
    element.tagName === "INPUT" &&
    "type" in element &&
    element.type === "password";

  if (isInPasswordField) {
    return;
  }

  const inCodeElement =
    element.tagName === "CODE" ||
    (!!element.closest && !!element.closest("code"));

  if (inCodeElement && getSettings("isDisabledInCodeElement")) {
    return;
  }

  const isInThisElement =
    document.querySelector("#simple-translate") &&
    document.querySelector("#simple-translate").contains(element);

  if (isInThisElement) {
    return;
  }

  removeTranslatecontainer();

  const ignoredDocumentLang = (getSettings("ignoredDocumentLang") as string)
    .split(",")
    .map((str) => str.trim())
    .filter((str) => !!str);

  if (ignoredDocumentLang.length) {
    const ignoredLangSelector = ignoredDocumentLang
      .map((lang) => `[lang="${lang}"]`)
      .join(",");

    if (!!element.closest && !!element.closest(ignoredLangSelector)) {
      return;
    }
  }

  const selectedText = getSelectedText();
  prevSelectedText = selectedText;

  if (selectedText.length === 0) {
    return;
  }

  if (getSettings("isDisabledInTextFields")) {
    if (isInContentEditable()) {
      return;
    }
  }

  if (getSettings("ifOnlyTranslateWhenModifierKeyPressed")) {
    const modifierKey = getSettings("modifierKey");

    switch (modifierKey) {
      case "shift":
        if (!event.shiftKey) {
          return;
        }
        break;
      case "alt":
        if (!event.altKey) {
          return;
        }
        break;
      case "ctrl":
        if (!event.ctrlKey) {
          return;
        }
        break;
      case "cmd":
        if (!event.metaKey) {
          return;
        }
        break;
      default:
        break;
    }
  }

  const clickedPosition = { x: event.clientX, y: event.clientY };
  const selectedPosition = getSelectedPosition();
  showTranslateContainer(selectedText, selectedPosition, clickedPosition);
}

const waitTime = (time: number) => {
  const result = new Promise<void>((resolve) =>
    setTimeout(() => resolve(), time)
  );

  return result;
};

const getSelectedText = () => {
  const element = document.activeElement as
    | HTMLInputElement
    | HTMLTextAreaElement;
  const isInTextField =
    element.tagName === "INPUT" || element.tagName === "TEXTAREA";
  const selectedText = isInTextField
    ? element.value.substring(element.selectionStart, element.selectionEnd)
    : window.getSelection()?.toString() ?? "";

  return selectedText;
};

function getSelectedPosition(): IPosition {
  const element = document.activeElement;
  const isInTextField =
    element.tagName === "INPUT" || element.tagName === "TEXTAREA";
  const selectedRect = isInTextField
    ? element.getBoundingClientRect()
    : window.getSelection().getRangeAt(0).getBoundingClientRect();

  let selectedPosition;
  const panelReferencePoint = getSettings("panelReferencePoint");

  switch (panelReferencePoint) {
    case "topSelectedText": {
      selectedPosition = {
        x: selectedRect.left + selectedRect.width / 2,
        y: selectedRect.top,
      };
      break;
    }

    case "bottomSelectedText":
    default: {
      selectedPosition = {
        x: selectedRect.left + selectedRect.width / 2,
        y: selectedRect.bottom,
      };
      break;
    }
  }

  return selectedPosition;
}

const isInContentEditable = () => {
  const element = document.activeElement as HTMLElement;

  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
    return true;
  }

  if (element.contentEditable === "true") {
    return true;
  }

  return false;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    removeTranslatecontainer();
  }
};

const handleVisibilityChange = () => {
  if (document.visibilityState === "hidden") {
    browser.storage.local.onChanged.removeListener(handleSettingsChange);
  } else {
    browser.storage.local.onChanged.addListener(handleSettingsChange);
  }
};

let isEnabled = true;
const handleMessage = async (request: { message: string }) => {
  const empty = new Promise((resolve) => {
    setTimeout(() => {
      return resolve("");
    }, 100);
  });

  switch (request.message) {
    case "getTabUrl": {
      if (!isEnabled) {
        return empty;
      }

      if (window == window.parent) {
        return location.href;
      } else {
        return empty;
      }
    }

    case "getSelectedText": {
      if (!isEnabled) {
        return empty;
      }

      if (prevSelectedText.length === 0) {
        return empty;
      } else {
        return prevSelectedText;
      }
    }

    case "translateSelectedText": {
      {
        if (!isEnabled) {
          return empty;
        }

        const selectedText = getSelectedText();

        if (selectedText.length === 0) {
          return;
        }

        const selectedPosition = getSelectedPosition();
        removeTranslatecontainer();
        showTranslateContainer(selectedText, selectedPosition, null, true);

        break;
      }
    }

    case "getEnabled": {
      return isEnabled;
    }

    case "enableExtension": {
      isEnabled = true;
      break;
    }

    case "disableExtension": {
      removeTranslatecontainer();
      isEnabled = false;
      break;
    }

    default: {
      return empty;
    }
  }
};

const disableExtensionByUrlList = () => {
  const disableUrls = getSettings("disableUrlList").split("\n");

  let pageUrl;
  try {
    pageUrl = top.location.href;
  } catch (e) {
    pageUrl = document.referrer;
  }

  const matchesPageUrl = (urlPattern: string) => {
    const pattern = urlPattern
      .trim()
      .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, (match) =>
        match === "*" ? ".*" : "\\" + match
      );
    if (pattern === "") return false;
    return RegExp("^" + pattern + "$").test(pageUrl);
  };

  const isMatched = disableUrls.some(matchesPageUrl);
  if (isMatched) isEnabled = false;
};

const removeTranslatecontainer = async () => {
  const element = document.getElementById("simple-translate");
  if (!element) return;

  ReactDOM.unmountComponentAtNode(element);
  element.parentNode.removeChild(element);
};

function showTranslateContainer(
  selectedText: string,
  selectedPosition: IPosition,
  clickedPosition: IPosition = null,
  shouldTranslate: boolean = false
) {
  const element = document.getElementById("simple-translate");

  if (element) {
    return;
  }

  if (!isEnabled) {
    return;
  }

  const themeClass = "simple-translate-" + getSettings("theme") + "-theme";

  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="simple-translate" class="${themeClass}"></div>`
  );

  ReactDOM.render(
    <TranslateContainer
      removeContainer={removeTranslatecontainer}
      selectedText={selectedText}
      selectedPosition={selectedPosition}
      clickedPosition={clickedPosition}
      shouldTranslate={shouldTranslate}
    />,
    document.getElementById("simple-translate")
  );
}
