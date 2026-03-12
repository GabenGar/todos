import clsx from "clsx";
import { createBlockComponent } from "@repo/ui/meta";
import {
  type IPaginationProps,
  Pagination,
  PaginationOverview,
} from "#components/pagination";
import type { IBaseComponentPropsWithChildren } from "#components/types";
import { useTranslation } from "#hooks";
//

import styles from "./list.module.scss";

interface IProps
  extends IBaseComponentPropsWithChildren<"div">,
    Pick<IPaginationProps, "pagination" | "buildURL"> {
  sortingOrder?: "ascending" | "descending";
}

/**
 * @TODO `previews` prop
 */
export const PreviewList = createBlockComponent(styles, Component);

function Component({
  pagination,
  buildURL,
  sortingOrder = "ascending",
  children,
  ...props
}: IProps) {
  const { t } = useTranslation("common");
  const listClass = clsx(
    styles.list,
    sortingOrder === "descending" && styles.descending,
  );

  return (
    <div {...props}>
      {pagination.totalCount === 0 ? (
        <p className={styles.nothing}>{t((t) => t.list.no_items)}</p>
      ) : (
        <>
          <PaginationOverview className={styles.info} pagination={pagination} />

          <div className={listClass}>{children}</div>

          <Pagination
            className={styles.pagination}
            pagination={pagination}
            buildURL={buildURL}
          />
        </>
      )}
    </div>
  );
}
