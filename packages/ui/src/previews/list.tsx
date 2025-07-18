import type { ReactNode } from "react";
import clsx from "clsx";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";
import {
  type IPaginationProps,
  PaginationOverview,
  Pagination,
} from "#pagination";
import { BIGINT_ZERO } from "#numbers/bigint";

import styles from "./list.module.scss";

interface IProps
  extends IBaseComponentPropsWithChildren<"div">,
    Pick<IPaginationProps, "pagination" | "buildURL" | "LinkButtonComponent"> {
  sortingOrder?: "ascending" | "descending";
  noItemsElement: ReactNode;
}

/**
 * @TODO `previews` prop
 */
export const PreviewList = createBlockComponent(styles, Component);

function Component({
  pagination,
  buildURL,
  LinkButtonComponent,
  sortingOrder = "ascending",
  noItemsElement,
  children,
  ...props
}: IProps) {
  const parsedTotalCount = BigInt(pagination.total_count);
  const listClass = clsx(
    styles.list,
    sortingOrder === "descending" && styles.descending,
  );

  return (
    <div {...props}>
      {parsedTotalCount === BIGINT_ZERO ? (
        <p className={styles.nothing}>{noItemsElement}</p>
      ) : (
        <>
          <PaginationOverview className={styles.info} pagination={pagination} />

          <div className={listClass}>{children}</div>

          <Pagination
            className={styles.pagination}
            pagination={pagination}
            buildURL={buildURL}
            LinkButtonComponent={LinkButtonComponent}
          />
        </>
      )}
    </div>
  );
}
