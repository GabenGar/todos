import React from "react";
import browser from "webextension-polyfill";
import { getSettings } from "../../settings/settings";
import openUrl from "../../common/openUrl";
import CopyButton from "./CopyButton";
import ListenButton from "./ListenButton";

import "./ResultArea.scss";

interface IProps {
  inputText: string;
  resultText: string;
  candidateText: string;
  isError: boolean;
  errorMessage: string;
  targetLang: string;
}

function ResultArea({
  inputText,
  resultText,
  candidateText,
  isError,
  errorMessage,
  targetLang,
}: IProps) {
  const shouldShowCandidate = getSettings("ifShowCandidate");
  const translationApi = getSettings("translationApi");

  const handleLinkClick = () => {
    const encodedText = encodeURIComponent(inputText);
    const translateUrl =
      translationApi === "google"
        ? `https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encodedText}`
        : `https://www.deepl.com/translator#auto/${targetLang}/${encodedText}`;
    openUrl(translateUrl);
  };

  return (
    <div id="resultArea">
      <p className="resultText" dir="auto">
        {splitLine(resultText)}
      </p>
      {shouldShowCandidate && (
        <p className="candidateText" dir="auto">
          {splitLine(candidateText)}
        </p>
      )}
      {isError && <p className="error">{errorMessage}</p>}
      {isError && (
        <p className="translateLink">
          <a onClick={handleLinkClick}>
            {translationApi === "google"
              ? browser.i18n.getMessage("openInGoogleLabel")
              : browser.i18n.getMessage("openInDeeplLabel")}
          </a>
        </p>
      )}
      <div className="mediaButtons">
        <CopyButton text={resultText} />
        <ListenButton text={resultText} lang={targetLang} />
      </div>
    </div>
  );
}

function splitLine(text: string) {
  const regex = /(\n)/g;
  const result = text
    .split(regex)
    .map((line, i) => (line.match(regex) ? <br key={i} /> : line));

  return result;
}

export default ResultArea;
