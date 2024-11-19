import browser from "webextension-polyfill";
import { initSettings } from "../settings/settings";
import translate from "../common/translate";

interface IData {
  message: "translate";
  text: string;
  sourceLang: string;
  targetLang: string;
}

async function onMessageListener(data: IData) {
  await initSettings();

  switch (data.message) {
    case "translate": {
      return await translate(data.text, data.sourceLang, data.targetLang);
    }
  }
}

export default onMessageListener;
