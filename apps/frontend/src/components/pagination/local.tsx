import type { CSSProperties } from "react";
import type { IPositiveInteger } from "#lib/numbers";
import type { IPagination } from "#lib/pagination";
import { Button } from "#components/button";
import { List, ListItem } from "#components/list";
import { createBlockComponent } from "#components/meta";
import type {
  IBaseComponentProps,
  ITranslatableProps,
} from "#components/types";

import styles from "./local.module.scss";

export interface IPaginationLocalProps
  extends IBaseComponentProps<"ul">,
    ITranslatableProps {
  pagination: IPagination;
  onPageChange: (nextPage: IPositiveInteger) => Promise<void>;
}

export const PaginationLocal = createBlockComponent(undefined, Component);

function Component({
  commonTranslation,
  pagination,
  onPageChange,
  ...props
}: IPaginationLocalProps) {
  const { first, previous, current, next, last } = commonTranslation.pagination;
  const { currentPage, totalPages } = pagination;
  const buttonWidth = Math.max(
    first.length,
    previous.length,
    current.length,
    next.length,
    last.length,
  );

  async function handlePageChange(page: IPositiveInteger) {
    await onPageChange(page);
  }

  return (
    <List
      style={{ "--local-min-width": `${buttonWidth}em` } as CSSProperties}
      {...props}
    >
      <ListItem>
        <Button
          disabled={currentPage === 1}
          onClick={async () => {
            await handlePageChange(1);
          }}
        >
          {first}
        </Button>
      </ListItem>

      <ListItem>
        <Button
          disabled={currentPage - 1 <= 0}
          onClick={async () => {
            await handlePageChange(currentPage - 1);
          }}
        >
          {previous}
        </Button>
      </ListItem>

      <ListItem>
        <Button
          disabled={currentPage + 1 >= totalPages + 1}
          onClick={async () => {
            await handlePageChange(currentPage + 1);
          }}
        >
          {next}
        </Button>
      </ListItem>

      <ListItem>
        <Button
          disabled={currentPage === totalPages}
          onClick={async () => {
            await handlePageChange(totalPages);
          }}
        >
          {last}
        </Button>
      </ListItem>
    </List>
  );
}
