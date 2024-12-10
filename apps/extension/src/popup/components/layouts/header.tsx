import browser from "webextension-polyfill";
import { createBlockComponent, type IBaseComponentProps } from "@repo/ui/meta";
import { Button } from "@repo/ui/buttons";
import { getLocalizedMessage } from "#lib/localization";

import styles from "./header.module.scss";

interface IProps extends IBaseComponentProps<"header"> {}

export const LayoutHeader = createBlockComponent(undefined, Component);

function Component({ ...props }: IProps) {
  return (
    <header {...props}>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          <li>{getLocalizedMessage("extension_title")}</li>
          <li>
            <Button onClick={() => browser.runtime.openOptionsPage()}>
              {getLocalizedMessage("Options")}
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
