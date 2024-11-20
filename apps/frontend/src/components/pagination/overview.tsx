import type { IPagination } from "#lib/pagination";
import { createBlockComponent } from "@repo/ui/meta";
import { List, ListItem } from "#components/list";
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
    <List {...props}>
      <ListItem>
        {currentMin} - {currentMax} {out_of} {totalCount}
      </ListItem>
      <ListItem>
        {current}: {currentPage}
      </ListItem>
    </List>
  );
}
