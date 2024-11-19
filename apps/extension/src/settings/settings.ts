// @ts-nocheck too much random generic shit
import browser from "webextension-polyfill";
import log from "loglevel";
import defaultSettings from "./defaultSettings";

const logDir = "settings/settings";
let currentSettings = {};

export const initSettings = async () => {
  const response = await browser.storage.local.get("Settings");
  currentSettings = response.Settings || {};
  let shouldSave = false;

  const pushSettings = (element) => {
    if (element.id == undefined || element.default == undefined) {
      return;
    }

    if (currentSettings[element.id] == undefined) {
      currentSettings[element.id] = element.default;
      shouldSave = true;
    }
  };

  const fetchDefaultSettings = () => {
    defaultSettings.forEach((category) => {
      category.elements.forEach((optionElement) => {
        pushSettings(optionElement);

        if ("childElements" in optionElement) {
          optionElement.childElements.forEach((childElement) => {
            pushSettings(childElement);
          });
        }
      });
    });
  };

  fetchDefaultSettings();

  if (shouldSave) {
    await browser.storage.local.set({ Settings: currentSettings });
  }
};

export const setSettings = async (id, value) => {
  log.info(logDir, "setSettings()", id, value);
  currentSettings[id] = value;
  await browser.storage.local.set({ Settings: currentSettings });
};

export const getSettings = (id: ISettingID) => {
  return currentSettings[id];
};

export const getAllSettings = () => {
  return currentSettings;
};

export const resetAllSettings = async () => {
  log.info(logDir, "resetAllSettings()");
  currentSettings = {};
  await browser.storage.local.set({ Settings: currentSettings });
  await initSettings();
};

export const handleSettingsChange = (changes) => {
  if (Object.keys(changes).includes("Settings")) {
    currentSettings = changes.Settings.newValue;
    return currentSettings;
  }
  return null;
};

export const exportSettings = async () => {
  const settingsIds = getSettingsIds();

  let settingsObj = {};
  for (const id of settingsIds) {
    settingsObj[id] = getSettings(id);
  }

  const downloadUrl = URL.createObjectURL(
    new Blob([JSON.stringify(settingsObj, null, "  ")], {
      type: "aplication/json",
    })
  );

  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = "SimpleTranslate_Settings.json";
  a.href = downloadUrl;
  a.click();
  a.remove();
  URL.revokeObjectURL(downloadUrl);
};

export async function importSettings(event: InputEvent) {
  const reader = new FileReader();

  reader.onload = async () => {
    const importedSettings = JSON.parse(reader.result as string);
    const settingsIds = getSettingsIds();

    for (const id of settingsIds) {
      if (importedSettings[id] !== undefined)
        await setSettings(id, importedSettings[id]);
    }

    // @ts-expect-error No idea which location interface
    location.reload(true);
  };

  const file = (event.target as HTMLInputElement).files[0];
  reader.readAsText(file);
}

function getSettingsIds() {
  let settingsIds: string[] = [];

  defaultSettings.forEach((category) => {
    category.elements.forEach((optionElement) => {
      if (optionElement.id && optionElement.default !== undefined) {
        settingsIds.push(optionElement.id);
      }

      if (optionElement.childElements) {
        optionElement.childElements.forEach((childElement) => {
          if (childElement.id && childElement.default !== undefined) {
            settingsIds.push(childElement.id);
          }
        });
      }
    });
  });

  return settingsIds;
}
