import { useState } from "react";
import { Details } from "@repo/ui/details";
import { MenuButtons, MenuItem } from "@repo/ui/buttons";
import { Preformatted } from "@repo/ui/formatting";
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
  const [error, changeError] = useState();
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
            try {
              await revokePermission(permission);
              changeError(undefined);
            } catch (error) {
              // @ts-expect-error
              changeError(error);
            }
          }}
        >
          {getLocalizedMessage("Disable")}
        </MenuItem>

        <MenuItem
          viewType="positive"
          disabled={isEnabled}
          onClick={async () => {
            try {
              await requestPermission(permission);
              changeError(undefined);
            } catch (error) {
              // @ts-expect-error
              changeError(error);
            }
          }}
        >
          {getLocalizedMessage("Enable")}
        </MenuItem>
      </MenuButtons>

      {error && <Preformatted>{String(error)}</Preformatted>}
    </Details>
  );
}
