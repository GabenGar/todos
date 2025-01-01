import browser from "webextension-polyfill";
import type { IPermission } from "./types";

export async function requestPermission(permission: IPermission) {
  return browser.permissions.request({ permissions: [permission] });
}

export async function revokePermission(permission: IPermission) {
  return browser.permissions.remove({ permissions: [permission] });
}
