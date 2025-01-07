import { useEffect, useState } from "react";
import {
  type ISettings,
  type ISettingKey,
  getSetting,
  settings,
} from "#lib/settings";
import { onLocalStorageChange } from "#lib/storage";
import { getAllpermissions } from "#lib/permissions";

/**
 * @TODO
 * context
 */
export function useSetting(settingKey: ISettingKey) {
  const [settingValue, changeSettingValue] = useState<ISettings[ISettingKey]>();
  const data = settings[settingKey];

  useEffect(() => {
    const localCleanup = onLocalStorageChange(handleLocalStorageChange);

    getSetting(settingKey).then((value) => changeSettingValue(value));

    return () => {
      localCleanup();
    };
  }, []);

  async function handleLocalStorageChange(
    changes: Parameters<Parameters<typeof onLocalStorageChange>[0]>[0]
  ) {
    const newValue = changes[settingKey].newValue;

    changeSettingValue(newValue as ISettings[ISettingKey]);
  }

  return settingValue;
}
