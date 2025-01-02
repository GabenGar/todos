import type { permissions } from "./permission-data";

export const availablePermissions = [
  "activeTab",
] as const satisfies (typeof permissions)[keyof typeof permissions][];

export type IPermission = (typeof availablePermissions)[number];
