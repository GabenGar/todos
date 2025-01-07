import { validatePermissions } from "#lib/permissions";
import { getLocalStorageValue, setLocalStorageValue } from "#lib/storage";
import { settings, type ISettingKey, type ISettings } from "./types";

export async function getSetting(
  setting: ISettingKey
): Promise<ISettings[ISettingKey]> {
  const settingData = settings[setting]
  const result = await getLocalStorageValue(setting, settingData.defaultValue);

  return result;
}

export async function updateSetting(
  setting: ISettingKey,
  data: ISettings[ISettingKey]
): Promise<ISettings[ISettingKey]> {
  const settingData = settings[setting]

  await validatePermissions(settingData.requiredPermissions)

  const result = await setLocalStorageValue(setting, data);

  return result;
}
