export const storageNames = ["planned_events"] as const;

export type IStorageName = (typeof storageNames)[number];
