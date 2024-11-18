import React, { Component, type ChangeEvent } from "react";
import browser from "webextension-polyfill";
import openUrl from "../../common/openUrl";
import { getSettings } from "../../settings/settings";

import "./Footer.scss";

interface IProps {
  tabUrl: string;
  targetLang: string;
  langHistory: string[];
  langList: { name: string; value: string }[];
  handleLangChange: (lang: string) => void;
}

interface IState {}

class Footer extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  handleLinkClick = async () => {
    const { tabUrl, targetLang } = this.props;
    const encodedUrl = encodeURIComponent(tabUrl);
    const translateUrl = `https://translate.google.com/translate?hl=${targetLang}&tl=${targetLang}&sl=auto&u=${encodedUrl}`;
    const isCurrentTab = getSettings("pageTranslationOpenTo") === "currentTab";
    openUrl(translateUrl, isCurrentTab);
  };

  handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const lang = event.target.value;
    this.props.handleLangChange(lang);
  };

  render() {
    const { tabUrl, targetLang, langHistory, langList } = this.props;

    return (
      <div id="footer">
        <div className="translateLink">
          {tabUrl && (
            <a onClick={this.handleLinkClick}>
              {browser.i18n.getMessage("showLink")}
            </a>
          )}
        </div>

        <div className="selectWrap">
          <select
            id="langList"
            value={targetLang}
            onChange={this.handleChange}
            title={browser.i18n.getMessage("targetLangLabel")}
          >
            <optgroup label={browser.i18n.getMessage("recentLangLabel")}>
              {langList
                .filter((option) => langHistory.includes(option.value))
                .map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.name}
                  </option>
                ))}
            </optgroup>

            <optgroup label={browser.i18n.getMessage("allLangLabel")}>
              {langList.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>
    );
  }
}

export default Footer;
