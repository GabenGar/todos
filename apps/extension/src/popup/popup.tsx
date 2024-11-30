import browser from "webextension-polyfill";
import log from "loglevel";
import { initSettings, getSettings, setSettings } from "../settings/settings";
import { updateLogLevel, overWriteLogLevel } from "../common/log";
import generateLangOptions, {
  type ILangOption,
} from "../common/generateLangOptions";
import Header from "./components/Header";
import InputArea from "./components/InputArea";
import ResultArea from "./components/ResultArea";
import Footer from "./components/Footer";
import { firefoxAddonUrl } from "../common/personalUrls";

import "@repo/ui/styles/global";
import "./popup.scss";

export function Popup() {
  return (
    <>
      <header>Link overwatch</header>

      <main>
        <h1>Hello World!</h1>
        <section></section>
      </main>

      <footer>
        <ul>
          <li>
            <a href={firefoxAddonUrl}>Firefox addon</a>
          </li>
        </ul>
      </footer>
    </>
  );
}
