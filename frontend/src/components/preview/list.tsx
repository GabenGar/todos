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
    ITranslatableProps {}

export const PreviewList = createBlockComponent(styles, Component);

function Component({
  commonTranslation,
  pagination,
  buildURL,
  children,
  ...props
}: IProps) {
  return (
    <div {...props}>
      <PaginationOverview
        commonTranslation={commonTranslation}
        pagination={pagination}
      />

      <div className={styles.list}>{children}</div>

      <Pagination
        commonTranslation={commonTranslation}
        pagination={pagination}
        buildURL={buildURL}
      />
    </div>
  );
}
