import { createBlockComponent } from "@repo/ui/meta";
import { List, ListItem } from "#lists";
import type { IBaseComponentProps } from "#meta";
import type { IPagination } from "./types";

import styles from "./overview.module.scss";

interface IProps extends IBaseComponentProps<"ul"> {
  pagination: IPagination;
}

export const PaginationOverview = createBlockComponent(styles, Component);

function Component({ pagination, ...props }: IProps) {
  const { current_page, current_min, current_max, total_count } = pagination;

  return (
    <List {...props}>
      <ListItem>
        {current_min} - {current_max} out of {total_count}
      </ListItem>
      <ListItem>Current: {current_page}</ListItem>
    </List>
  );
}
