import { Details } from "@repo/ui/details";
import { getLocalizedMessage } from "#lib/localization";
import { settings, type ISettingKey } from "#lib/settings";

import styles from "./setting.module.scss";

interface IProps {
  setting: ISettingKey;
}

export function Setting({ setting }: IProps) {
  const isEnabled = false;
  const message = getLocalizedMessage(settings[setting]);

  return (
    <Details
      summary={
        <>
          {message}:{" "}
          {isEnabled ? (
            <span className={styles.enabled}>
              {getLocalizedMessage("enabled")}
            </span>
          ) : (
            <span className={styles.disabled}>
              {getLocalizedMessage("disabled")}
            </span>
          )}
        </>
      }
    ></Details>
  );
}
