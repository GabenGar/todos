import type { FunctionComponent, CSSProperties, ReactNode } from "react";
import { createBlockComponent, type IBaseComponentProps } from "#meta";
import { LinkButton } from "#links";
import { List, ListItem } from "#lists";
import { BIGINT_ONE, BIGINT_ZERO } from "#numbers/bigint";
import { PaginationOverview } from "./overview";
import type { IPagination } from "./types";

import styles from "./pagination.module.scss";

export interface IPaginationProps extends IBaseComponentProps<"ul"> {
  pagination: IPagination;
  buildURL: (page: string) => string;
  LinkButtonComponent?: FunctionComponent<IBaseLinkButtonProps>;
}

interface IBaseLinkButtonProps {
  href: string;
  className?: string;
  children?: ReactNode;
}

export const Pagination = createBlockComponent(styles, Component);

function Component({
  pagination,
  buildURL,
  LinkButtonComponent = LinkButton,
  ...props
}: IPaginationProps) {
  const { current_page, total_pages } = pagination;
  const parsedCurrentPage = BigInt(current_page);
  const parsedTotalPages = BigInt(total_pages);
  const first = "First";
  const previous = "Previous";
  const current = "Current";
  const next = "Next";
  const last = "Last";
  const buttonWidth = Math.max(
    first.length,
    previous.length,
    current.length,
    next.length,
    last.length,
  );

  return (
    <List
      style={{ "--local-min-width": `${buttonWidth}em` } as CSSProperties}
      {...props}
    >
      <ListItem className={styles.first}>
        {parsedCurrentPage === BIGINT_ONE ||
        parsedCurrentPage === BIGINT_ZERO ? (
          <span className={styles.disabled}>
            <span>|&lt;</span> <span>{first}</span>
          </span>
        ) : (
          <LinkButtonComponent
            href={buildURL(String(BIGINT_ONE))}
            className={styles.button}
          >
            <span>|&lt;</span> <span>{first}</span>
          </LinkButtonComponent>
        )}
      </ListItem>

      <ListItem className={styles.previous}>
        {parsedCurrentPage - BIGINT_ONE <= BIGINT_ZERO ? (
          <span className={styles.disabled}>
            <span>&lt;</span> <span>{previous}</span>
          </span>
        ) : (
          <LinkButtonComponent
            href={buildURL(String(parsedCurrentPage - BIGINT_ONE))}
            className={styles.button}
          >
            <span>&lt;</span> <span>{previous}</span>
          </LinkButtonComponent>
        )}
      </ListItem>

      <ListItem className={styles.current}>
        <PaginationOverview pagination={pagination} />
      </ListItem>

      <ListItem className={styles.next}>
        {parsedCurrentPage + BIGINT_ONE >= parsedTotalPages + BIGINT_ONE ? (
          <span className={styles.disabled}>
            <span>&gt;</span> <span>{next}</span>
          </span>
        ) : (
          <LinkButtonComponent
            href={buildURL(String(parsedCurrentPage + BIGINT_ONE))}
            className={styles.button}
          >
            <span>&gt;</span> <span>{next}</span>
          </LinkButtonComponent>
        )}
      </ListItem>

      <ListItem className={styles.last}>
        {parsedCurrentPage === parsedTotalPages ? (
          <span className={styles.disabled}>
            <span>&gt;|</span> <span>{last}</span>
          </span>
        ) : (
          <LinkButtonComponent
            href={buildURL(total_pages)}
            className={styles.button}
          >
            <span>&gt;|</span> <span>{last}</span>
          </LinkButtonComponent>
        )}
      </ListItem>
    </List>
  );
}
