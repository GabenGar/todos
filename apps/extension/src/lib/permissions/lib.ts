import browser from "webextension-polyfill";
import { getLocalizedMessage } from "#lib/localization";
import type { IPermission } from "./types";

export async function getAllpermissions(): Promise<IPermission[]> {
  const result = await browser.permissions.getAll();

  return (result.permissions ?? []) as IPermission[];
}

export async function validatePermissions(permissions: readonly IPermission[]) {
  const isPermitted = await browser.permissions.contains({
    // @ts-expect-error lib types
    permissions,
  });

  if (!isPermitted) {
    const allPerms = await getAllpermissions();
    const missingPerms = permissions.filter((perm) => !allPerms.includes(perm));
    const message =
      missingPerms.length === 1
        ? getLocalizedMessage(
            'Permission "$PERMISSION$" is not enabled.',
            missingPerms[0]
          )
        : getLocalizedMessage(
            "Permissions $PERMISSIONS$ are not enabled.",
            missingPerms
              .sort()
              .map((perm) => `"${perm}"`)
              .join(",")
          );

    throw new Error(message);
  }
}

export async function validatePermission(permission: IPermission) {
  const isPermitted = await browser.permissions.contains({
    permissions: [permission],
  });

  if (!isPermitted) {
    const message = getLocalizedMessage(
      'Permission "$PERMISSION$" is not enabled.',
      permission
    );
    throw new Error(message);
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
