import type { CSSProperties } from "react";
import { createBlockComponent } from "@repo/ui/meta";
import { Button } from "#components/button";
import { List, ListItem } from "#components/list";
import type { IBaseComponentProps } from "#components/types";
import { useTranslation } from "#hooks";
import type { IPositiveInteger } from "#lib/numbers";
import type { IPagination } from "#lib/pagination";
//

import styles from "./local.module.scss";

export interface IPaginationLocalProps extends IBaseComponentProps<"ul"> {
  pagination: IPagination;
  onPageChange: (nextPage: IPositiveInteger) => Promise<void>;
}

export const PaginationLocal = createBlockComponent(styles, Component);

function Component({
  pagination,
  onPageChange,
  ...props
}: IPaginationLocalProps) {
  const { t } = useTranslation("common");
  const { currentPage, totalPages } = pagination;
  const buttonWidth = Math.max(
    t((t) => t.pagination.first).length,
    t((t) => t.pagination.previous).length,
    t((t) => t.pagination.current).length,
    t((t) => t.pagination.next).length,
    t((t) => t.pagination.last).length,
  );

  async function handlePageChange(page: IPositiveInteger) {
    await onPageChange(page);
  }

  return (
    <List
      style={{ "--local-min-width": `${buttonWidth}em` } as CSSProperties}
      {...props}
    >
      <ListItem className={styles.first}>
        <Button
          className={styles.button}
          disabled={currentPage === 1}
          onClick={async () => {
            await handlePageChange(1);
          }}
        >
          {t((t) => t.pagination.first)}
        </Button>
      </ListItem>

      <ListItem className={styles.previous}>
        <Button
          className={styles.button}
          disabled={currentPage - 1 <= 0}
          onClick={async () => {
            await handlePageChange(currentPage - 1);
          }}
        >
          {t((t) => t.pagination.previous)}
        </Button>
      </ListItem>

      <ListItem className={styles.next}>
        <Button
          className={styles.button}
          disabled={currentPage + 1 >= totalPages + 1}
          onClick={async () => {
            await handlePageChange(currentPage + 1);
          }}
        >
          {t((t) => t.pagination.next)}
        </Button>
      </ListItem>

      <ListItem className={styles.last}>
        <Button
          className={styles.button}
          disabled={currentPage === totalPages}
          onClick={async () => {
            await handlePageChange(totalPages);
          }}
        >
          {t((t) => t.pagination.last)}
        </Button>
      </ListItem>
    </List>
  );
}
