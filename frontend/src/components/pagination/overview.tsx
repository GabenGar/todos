import type { IPagination } from "#lib/pagination";
import { createBlockComponent } from "#components/meta";
import type {
  IBaseComponentProps,
  ITranslatableProps,
} from "#components/types";

import styles from "./overview.module.scss";

interface IProps extends IBaseComponentProps<"ul">, ITranslatableProps {
  pagination: IPagination;
}

export const PaginationOverview = createBlockComponent(styles, Component);

function Component({ commonTranslation, pagination, ...props }: IProps) {
  const { current, out_of } = commonTranslation.pagination;
  const { currentPage, currentMin, currentMax, totalCount } = pagination;

  return (
    <ul {...props}>
      <li>
        {currentMin} - {currentMax} {out_of} {totalCount}
      </li>
      <li>
        {current}: {currentPage}
      </li>
    </ul>
  );
}
