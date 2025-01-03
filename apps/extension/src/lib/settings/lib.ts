import { getLocalStorageValue } from "#lib/storage";
import type { ISettingKey, ISettings } from "./types";

export async function getSetting(
  setting: ISettingKey,
  defaultValue?: ISettings[ISettingKey]
): Promise<ISettings[ISettingKey]> {
  const result = await getLocalStorageValue(setting, defaultValue);

  return result;
}
