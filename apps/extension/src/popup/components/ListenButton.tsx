import React from "react";
import browser from "webextension-polyfill";
import log from "loglevel";
import SpeakerIcon from "../icons/speaker.svg";

import "./ListenButton.scss";

const logDir = "popup/AudioButton";

interface IProps {
  text: string;
  lang: string;
}

function ListenButton({ text, lang }: IProps) {
  const canListen = text && text.length < 200;

  if (!canListen) {
    return null;
  }

  return (
    <button
      className="listenButton"
      onClick={() => playAudio(text, lang)}
      title={browser.i18n.getMessage("listenLabel")}
    >
      <SpeakerIcon />
    </button>
  );
}

async function playAudio(text: string, lang: string) {
  const url = `https://translate.google.com/translate_tts?client=tw-ob&q=${encodeURIComponent(
    text
  )}&tl=${lang}`;
  const audio = new Audio(url);
  audio.crossOrigin = "anonymous";
  audio.load();

  await browser.permissions.request({
    origins: ["https://translate.google.com/*"],
  });

  await audio.play().catch((error) => log.error(logDir, "playAudio()", error, url));
}

export default ListenButton;
