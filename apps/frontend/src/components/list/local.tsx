import type { IPagination } from "#lib/pagination";
import { createBlockComponent } from "@repo/ui/meta";
import type {
  IBaseComponentPropsWithChildren,
  ITranslatableProps,
} from "#components/types";
import {
  IPaginationLocalProps,
  PaginationLocal,
  PaginationOverview,
} from "#components/pagination";
import { List } from "./list";

import styles from "./local.module.scss";

export interface IListLocalProps
  extends IBaseComponentPropsWithChildren<"div">,
    ITranslatableProps,
    Pick<IPaginationLocalProps, "onPageChange"> {
  pagination: IPagination;
}

export const ListLocal = createBlockComponent(styles, Component);

function Component({
  commonTranslation,
  pagination,
  onPageChange,
  children,
  ...props
}: IListLocalProps) {
  return (
    <div {...props}>
      <PaginationOverview
        commonTranslation={commonTranslation}
        pagination={pagination}
      />

      <List className={styles.list} isAlternating>
        {children}
      </List>

      <PaginationLocal
        commonTranslation={commonTranslation}
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </div>
  );
}
