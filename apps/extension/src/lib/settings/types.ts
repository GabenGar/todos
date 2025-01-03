export interface ISettings {
  page_action: boolean;
}

export const settings = {
  page_action: {
    message: "Address bar button",
    requiredPermissions: ["activeTab", "storage"],
  },
} as const;

export const settingKeys: (keyof typeof settings)[] = Object.keys(
  settings
) as (keyof typeof settings)[];

export type ISettingKey = keyof typeof settings;
