import React, { Component } from "react";
import browser from "webextension-polyfill";
import { updateLogLevel, overWriteLogLevel } from "../../common/log";
import {
  initSettings,
  getAllSettings,
  resetAllSettings,
  exportSettings,
  importSettings,
  handleSettingsChange,
} from "../../settings/settings";
import defaultSettings from "../../settings/defaultSettings";
import CategoryContainer from "./CategoryContainer";

interface IProps {}

interface IState {
  isInit: boolean;
  currentValues: ReturnType<typeof getAllSettings>;
}

export default class SettingsPage extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isInit: false,
      currentValues: {} as ReturnType<typeof getAllSettings>,
    };
    this.init();
  }

  async init() {
    await initSettings();
    overWriteLogLevel();
    updateLogLevel();

    this.setState({ isInit: true, currentValues: getAllSettings() });

    browser.storage.local.onChanged.addListener((changes) => {
      const newSettings = handleSettingsChange(changes);

      if (newSettings) this.setState({ currentValues: newSettings });
    });
  }

  render() {
    const { isInit, currentValues } = this.state;
    const settingsContent = (
      <ul>
        {defaultSettings.map((category, index) => (
          <CategoryContainer
            {...category}
            key={index}
            currentValues={currentValues}
          />
        ))}
        <CategoryContainer
          {...additionalCategory}
          currentValues={currentValues}
        />
      </ul>
    );

    return (
      <div>
        <p className="contentTitle">
          {browser.i18n.getMessage("settingsLabel")}
        </p>
        <hr />
        {isInit ? settingsContent : ""}
      </div>
    );
  }
}

const additionalCategory = {
  category: "",
  elements: [
    {
      id: "importSettings",
      title: "importSettingsLabel",
      captions: ["importSettingsCaptionLabel"],
      type: "file",
      accept: ".json",
      value: "importButtonLabel",
      onChange: importSettings,
    },
    {
      id: "exportSettings",
      title: "exportSettingsLabel",
      captions: ["exportSettingsCaptionLabel"],
      type: "button",
      value: "exportButtonLabel",
      onClick: async () => {
        await exportSettings();
      },
    },
    {
      id: "resetSettings",
      title: "resetSettingsLabel",
      captions: ["resetSettingsCaptionLabel"],
      type: "button",
      value: "resetSettingsButtonLabel",
      onClick: async () => {
        await resetAllSettings();
        // @ts-expect-error no idea which `Location` object it is
        location.reload(true);
      },
    },
  ],
};