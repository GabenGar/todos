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
    let addedCleanup: ReturnType<typeof onPermissionAdded> | undefined =
      undefined;
    let removedCleanup: ReturnType<typeof onPermissionRemoved> | undefined =
      undefined;

    getAllpermissions().then((perms) => {
      const permsSet = new Set(perms);
      changePermissions(permsSet);

      addedCleanup = onPermissionAdded((perms) => {
        const addedPerms = perms.permissions;

        if (!addedPerms) {
          return;
        }

        const newPerms = new Set(permissions);

        for (const perm of addedPerms) {
          newPerms.add(perm as IPermission);
        }

        changePermissions(newPerms);
      });

      removedCleanup = onPermissionRemoved((perms) => {
        const removedPerms = perms.permissions;

        if (!removedPerms) {
          return;
        }

        const newPerms = new Set(permissions);

        for (const perm of removedPerms) {
          newPerms.delete(perm as IPermission);
        }

        changePermissions(newPerms);
      });
    });

    return () => {
      addedCleanup?.();
      removedCleanup?.();
    };
  }, []);

  return permissions;
}
