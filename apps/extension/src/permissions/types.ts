export const availablePermissions = ["activeTab"] as const;

export type IPermission = (typeof availablePermissions)[number];
