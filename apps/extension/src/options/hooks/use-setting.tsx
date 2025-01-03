import { useEffect, useState } from "react";
import { type ISettings, type ISettingKey, getSetting } from "#lib/settings";
import { onLocalStorageChange } from "#lib/storage";

/**
 * @TODO
 * context
 */
export function useSetting(settingKey: ISettingKey) {
  const [settingValue, changeSettingValue] = useState<ISettings[ISettingKey]>();

  useEffect(() => {
    const cleanup = onLocalStorageChange((changes) => {
      const newValue = changes[settingKey].newValue;

      changeSettingValue(newValue as ISettings[ISettingKey]);
    });

    getSetting(settingKey).then((value) => changeSettingValue(value));

    return () => {
      cleanup?.();
    };
  }, []);

  return settingValue;
}
