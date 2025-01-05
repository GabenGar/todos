import { useEffect, useState } from "react";
import {
  getAllpermissions,
  onPermissionAdded,
  onPermissionRemoved,
  type IPermission,
} from "#lib/permissions";

export function usePermissions() {
  const [permissions, changePermissions] = useState<Set<IPermission>>();

  useEffect(() => {
    const addedCleanup = onPermissionAdded(onAdded);
    const removedCleanup = onPermissionRemoved(onRemoved);

    getAllpermissions().then((perms) => {
      const permsSet = new Set(perms);
      changePermissions(permsSet);
    });

    return () => {
      addedCleanup();
      removedCleanup();
    };
  }, []);

  async function onAdded(
    perms: Parameters<Parameters<typeof onPermissionAdded>[0]>[0]
  ) {
    const addedPerms = perms.permissions;

    if (!addedPerms) {
      return;
    }

    const newPerms = new Set(permissions);

    for (const perm of addedPerms) {
      newPerms.add(perm as IPermission);
    }

    changePermissions(newPerms);
  }

  async function onRemoved(
    perms: Parameters<Parameters<typeof onPermissionRemoved>[0]>[0]
  ) {
    const removedPerms = perms.permissions;

    if (!removedPerms) {
      return;
    }

    const newPerms = new Set(permissions);

    for (const perm of removedPerms) {
      newPerms.delete(perm as IPermission);
    }

    changePermissions(newPerms);
  }

  return permissions;
}
