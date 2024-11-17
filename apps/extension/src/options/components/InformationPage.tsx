import React from "react";
import browser from "webextension-polyfill";
// @ts-expect-error there are no types
import browserInfo from "browser-info";
import queryString from "query-string";
import OptionsContainer from "./OptionContainer";
import {
  email,
  chromeExtensionUrl,
  firefoxAddonUrl,
} from "../../common/personalUrls";
import manifest from "../../manifest-chrome.json";
import { useAdditionalPermission } from "../hooks/use-permission";

interface IProps {
  location: Location
}

function InformationPage(props: IProps) {

  const query = queryString.parse(props.location.search);
  const extensionVersion = manifest.version;

  const [hasPermission, requestPermission] = useAdditionalPermission();

  return (
    <div>
      <p className="contentTitle">
        {browser.i18n.getMessage("informationLabel")}
      </p>
      <hr />
      <OptionsContainer
        title={"extName"}
        captions={[]}
        type={"none"}
        updated={query.action === "updated"}
        extraCaption={
          <p className="caption">
            <a href="https://github.com/GabenGar/todos" target="_blank">
              Version {extensionVersion}
            </a>
          </p>
        }
      />

      <OptionsContainer
        title={"licenseLabel"}
        captions={["Mozilla Public License, Version. 2.0"]}
        useRawCaptions={true}
        type={"none"}
      />

      {!hasPermission && (
        <>
          <hr />
          <OptionsContainer
            title={"additionalPermissionLabel"}
            captions={["additionalPermissionCaptionLabel"]}
            type={"button"}
            value={"enableLabel"}
            onClick={requestPermission}
          />
        </>
      )}

      <hr />
      <OptionsContainer
        title={""}
        captions={[]}
        type={"none"}
        extraCaption={
          <div>
            <p className="caption">email: {email}</p>
          </div>
        }
      />
      <hr />
      <OptionsContainer
        title={""}
        captions={[]}
        type={"none"}
        extraCaption={
          <div>
            <p>
              {browserInfo().name === "Chrome" ? (
                <a href={chromeExtensionUrl} target="_blank">
                  {browser.i18n.getMessage("extensionPageLabel")}
                </a>
              ) : (
                <a href={firefoxAddonUrl} target="_blank">
                  {browser.i18n.getMessage("addonPageLabel")}
                </a>
              )}
              <span>　</span>
              <a
                href="https://github.com/sienori/simple-translate"
                target="_blank"
              >
                GitHub
              </a>
            </p>
          </div>
        }
      />
    </div>
  );
}

export default InformationPage;
