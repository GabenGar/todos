export const settings = {
  page_action: "Address bar button",
} as const;

export const settingKeys: (keyof typeof settings)[] = Object.keys(
  settings
) as (keyof typeof settings)[];

export type ISettingKey = keyof typeof settings;
