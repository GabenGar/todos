import { createBlockComponent } from "@repo/ui/meta";
import {
  type IPaginationLocalProps,
  PaginationLocal,
  PaginationOverview,
} from "#components/pagination";
import type { IBaseComponentPropsWithChildren } from "#components/types";
import type { IPagination } from "#lib/pagination";
import { List } from "./list";
//

import styles from "./local.module.scss";

export interface IListLocalProps
  extends IBaseComponentPropsWithChildren<"div">,
    Pick<IPaginationLocalProps, "onPageChange"> {
  pagination: IPagination;
}

export const ListLocal = createBlockComponent(styles, Component);

function Component({
  pagination,
  onPageChange,
  children,
  ...props
}: IListLocalProps) {
  return (
    <div {...props}>
      <PaginationOverview pagination={pagination} />

      <List className={styles.list} isAlternating>
        {children}
      </List>

      <PaginationLocal pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
}
