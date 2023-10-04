import clsx from "clsx";
import { createBlockComponent } from "#components/meta";
import {
  type IPaginationProps,
  PaginationOverview,
  Pagination,
} from "#components/pagination";
import type {
  IBaseComponentPropsWithChildren,
  ITranslatableProps,
} from "#components/types";

import styles from "./list.module.scss";

interface IProps
  extends IBaseComponentPropsWithChildren<"div">,
    Pick<IPaginationProps, "pagination" | "buildURL">,
    ITranslatableProps {
  sortingOrder?: "ascending" | "descending";
}

/**
 * @TODO `previews` prop
 */
export const PreviewList = createBlockComponent(styles, Component);

function Component({
  commonTranslation,
  pagination,
  buildURL,
  sortingOrder = "ascending",
  children,
  ...props
}: IProps) {
  const listClass = clsx(
    styles.list,
    sortingOrder === "descending" && styles.descending,
  );

  return (
    <div {...props}>
      {pagination.totalCount === 0 ? (
        <p className={styles.nothing}>{commonTranslation.list.no_items}</p>
      ) : (
        <>
          <PaginationOverview
            className={styles.info}
            commonTranslation={commonTranslation}
            pagination={pagination}
          />

          <div className={listClass}>{children}</div>

          <Pagination
            className={styles.pagination}
            commonTranslation={commonTranslation}
            pagination={pagination}
            buildURL={buildURL}
          />
        </>
      )}
    </div>
  );
}
