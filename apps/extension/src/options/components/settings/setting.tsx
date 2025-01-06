import { useState } from "react";
import { Details } from "@repo/ui/details";
import { MenuButtons, MenuItem } from "@repo/ui/buttons";
import { Preformatted } from "@repo/ui/formatting";
import { getLocalizedMessage } from "#lib/localization";
import { settings, updateSetting, type ISettingKey } from "#lib/settings";
import { useSetting } from "#options/hooks";

import styles from "./setting.module.scss";

interface IProps {
  setting: ISettingKey;
}

export function Setting({ setting }: IProps) {
  const [error, changeError] = useState<Error>();
  const value = useSetting(setting);
  const isEnabled = Boolean(value);
  const message = getLocalizedMessage(settings[setting].message);

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
    >
      <MenuButtons>
        <MenuItem
          viewType="negative"
          disabled={!isEnabled}
          onClick={async () => {
            try {
              await updateSetting(setting, false);
              changeError(undefined);
            } catch (error) {
              // @ts-expect-error
              changeError(error);
            }
          }}
        >
          {getLocalizedMessage("Disable")}
        </MenuItem>

        <MenuItem
          viewType="positive"
          disabled={isEnabled}
          onClick={async () => {
            try {
              await updateSetting(setting, true);
              changeError(undefined);
            } catch (error) {
              // @ts-expect-error
              changeError(error);
            }
          }}
        >
          {getLocalizedMessage("Enable")}
        </MenuItem>
      </MenuButtons>

      {error && <Preformatted>{String(error)}</Preformatted>}
    </Details>
  );
}
