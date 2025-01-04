import browser from "webextension-polyfill";
import type { IPermission } from "./types";

export async function getAllpermissions(): Promise<IPermission[]> {
  const result = await browser.permissions.getAll();

  return (result.permissions ?? []) as IPermission[];
}

export async function validatePermission(permission: IPermission) {
  const isPermitted = await browser.permissions.contains({
    permissions: [permission],
  });

  if (!isPermitted) {
    throw new Error(`Permission "${permission}" is not enabled.`);
  }
}

export async function requestPermission(permission: IPermission) {
  return browser.permissions.request({ permissions: [permission] });
}

export async function revokePermission(permission: IPermission) {
  return browser.permissions.remove({ permissions: [permission] });
}

export function onPermissionAdded(
  listener: Parameters<typeof browser.permissions.onAdded.addListener>[0]
) {
  browser.permissions.onAdded.addListener(listener);

  const cleanUpFunction = () =>
    browser.permissions.onAdded.removeListener(listener);

  return cleanUpFunction;
}

export function onPermissionRemoved(
  listener: Parameters<typeof browser.permissions.onRemoved.addListener>[0]
) {
  browser.permissions.onRemoved.addListener(listener);

  const cleanUpFunction = () =>
    browser.permissions.onRemoved.removeListener(listener);

  return cleanUpFunction;
}
