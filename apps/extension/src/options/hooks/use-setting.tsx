import { useEffect, useState } from "react";
import {
  getSetting,
  type ISettingKey,
  type ISettings,
  // settings,
} from "#lib/settings";
import { onLocalStorageChange } from "#lib/storage";

/**
 * @TODO
 * context
 */
export function useSetting(settingKey: ISettingKey) {
  const [settingValue, changeSettingValue] = useState<ISettings[ISettingKey]>();
  // const data = settings[settingKey];

  // biome-ignore lint/correctness/useExhaustiveDependencies: blah
  useEffect(() => {
    const localCleanup = onLocalStorageChange(handleLocalStorageChange);

    getSetting(settingKey).then((value) => changeSettingValue(value));

    return () => {
      localCleanup();
    };
  }, []);

  async function handleLocalStorageChange(
    changes: Parameters<Parameters<typeof onLocalStorageChange>[0]>[0],
  ) {
    const newValue = changes[settingKey].newValue;

    changeSettingValue(newValue as ISettings[ISettingKey]);
  }

  return settingValue;
}
