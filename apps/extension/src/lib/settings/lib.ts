import { getLocalStorageValue, setLocalStorageValue } from "#lib/storage";
import type { ISettingKey, ISettings } from "./types";

export async function getSetting(
  setting: ISettingKey,
  defaultValue?: ISettings[ISettingKey]
): Promise<ISettings[ISettingKey]> {
  const result = await getLocalStorageValue(setting, defaultValue);

  return result;
}

export async function updateSetting(
  setting: ISettingKey,
  data: ISettings[ISettingKey]
): Promise<ISettings[ISettingKey]> {
  const result = await setLocalStorageValue(setting, data);

  return result;
}
