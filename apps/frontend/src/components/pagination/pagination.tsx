import type { CSSProperties } from "react";
import { createBlockComponent } from "@repo/ui/meta";
import { LinkButton } from "#components/link";
import { List, ListItem } from "#components/list";
import type { IBaseComponentProps } from "#components/types";
import { useTranslation } from "#hooks";
import type { IPagination } from "#lib/pagination";
import { PaginationOverview } from "./overview";
//

import styles from "./pagination.module.scss";

export interface IPaginationProps extends IBaseComponentProps<"ul"> {
  pagination: IPagination;
  buildURL: (page: number) => string;
}

/**
 * @TODO button icons
 */
export const Pagination = createBlockComponent(styles, Component);

function Component({ pagination, buildURL, ...props }: IPaginationProps) {
  const { t } = useTranslation("common");
  const { currentPage, totalPages } = pagination;
  const buttonWidth = Math.max(
    t((t) => t.pagination.first).length,
    t((t) => t.pagination.previous).length,
    t((t) => t.pagination.current).length,
    t((t) => t.pagination.next).length,
    t((t) => t.pagination.last).length,
  );

  return (
    <List
      style={{ "--local-min-width": `${buttonWidth}em` } as CSSProperties}
      {...props}
    >
      <ListItem className={styles.first}>
        {currentPage === 1 || currentPage === 0 ? (
          <span className={styles.disabled}>
            <span>|&lt;</span> <span>{t((t) => t.pagination.first)}</span>
          </span>
        ) : (
          <LinkButton href={buildURL(1)} className={styles.button}>
            <span>|&lt;</span> <span>{t((t) => t.pagination.first)}</span>
          </LinkButton>
        )}
      </ListItem>

      <ListItem className={styles.previous}>
        {currentPage - 1 <= 0 ? (
          <span className={styles.disabled}>
            <span>&lt;</span> <span>{t((t) => t.pagination.previous)}</span>
          </span>
        ) : (
          <LinkButton
            href={buildURL(currentPage - 1)}
            className={styles.button}
          >
            <span>&lt;</span> <span>{t((t) => t.pagination.previous)}</span>
          </LinkButton>
        )}
      </ListItem>

      <ListItem className={styles.current}>
        <PaginationOverview pagination={pagination} />
      </ListItem>

      <ListItem className={styles.next}>
        {currentPage + 1 >= totalPages + 1 ? (
          <span className={styles.disabled}>
            <span>&gt;</span> <span>{t((t) => t.pagination.next)}</span>
          </span>
        ) : (
          <LinkButton
            href={buildURL(currentPage + 1)}
            className={styles.button}
          >
            <span>&gt;</span> <span>{t((t) => t.pagination.next)}</span>
          </LinkButton>
        )}
      </ListItem>

      <ListItem className={styles.last}>
        {currentPage === totalPages ? (
          <span className={styles.disabled}>
            <span>&gt;|</span> <span>{t((t) => t.pagination.last)}</span>
          </span>
        ) : (
          <LinkButton href={buildURL(totalPages)} className={styles.button}>
            <span>&gt;|</span> <span>{t((t) => t.pagination.last)}</span>
          </LinkButton>
        )}
      </ListItem>
    </List>
  );
}
