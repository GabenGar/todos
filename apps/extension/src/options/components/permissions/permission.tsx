import { Details } from "@repo/ui/details";
import { MenuButtons, MenuItem } from "@repo/ui/buttons";
import { getLocalizedMessage } from "#lib/localization";
import {
  requestPermission,
  revokePermission,
  type IPermission,
} from "#lib/permissions";
import { Loading } from "#components/loading";
import { usePermissions } from "#options/hooks";

import styles from "./permission.module.scss";

interface IProps {
  permission: IPermission;
}

export function Permission({ permission }: IProps) {
  const permissions = usePermissions();
  const isEnabled = permissions?.has(permission);

  return !permissions ? (
    <Loading />
  ) : (
    <Details
      summary={
        <>
          {permission}:{" "}
          {isEnabled ? (
            <span className={styles.enabled}>
              {getLocalizedMessage("enabled")}
            </span>
          ) : (
            <span className={styles.disabled}>
              {getLocalizedMessage("disabled")}
            </span>
          )}
        </>
      }
    >
      <MenuButtons>
        <MenuItem
          viewType="negative"
          disabled={!isEnabled}
          onClick={async () => {
            await revokePermission(permission);
          }}
        >
          {getLocalizedMessage("Disable")}
        </MenuItem>

        <MenuItem
          viewType="positive"
          disabled={isEnabled}
          onClick={async () => {
            await requestPermission(permission);
          }}
        >
          {getLocalizedMessage("Enable")}
        </MenuItem>
      </MenuButtons>
    </Details>
  );
}
