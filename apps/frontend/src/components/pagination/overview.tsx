import { createBlockComponent } from "@repo/ui/meta";
import { List, ListItem } from "#components/list";
import type { IBaseComponentProps } from "#components/types";
import { useTranslation } from "#hooks";
import type { IPagination } from "#lib/pagination";
//

import styles from "./overview.module.scss";

interface IProps extends IBaseComponentProps<"ul"> {
  pagination: IPagination;
}

export const PaginationOverview = createBlockComponent(styles, Component);

function Component({ pagination, ...props }: IProps) {
  const { t } = useTranslation("common");
  const { currentPage, currentMin, currentMax, totalCount } = pagination;

  return (
    <List {...props}>
      <ListItem>
        {currentMin} - {currentMax} {t((t) => t.pagination.out_of)} {totalCount}
      </ListItem>
      <ListItem>
        {t((t) => t.pagination.current)}: {currentPage}
      </ListItem>
    </List>
  );
}
