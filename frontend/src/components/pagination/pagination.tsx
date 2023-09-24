import type { CSSProperties } from "react";
import type { ILocalizationCommon } from "#lib/localization";
import type { IPagination } from "#lib/pagination";
import type { IBaseComponentProps } from "#components/types";
import { createBlockComponent } from "#components/meta";
import { LinkButton } from "#components/link";
import { PaginationOverview } from "./overview";

import styles from "./pagination.module.scss";

export interface IPaginationProps extends IBaseComponentProps<"ul"> {
  commonTranslation: ILocalizationCommon;
  pagination: IPagination;
  buildURL: (page: number) => string;
}

/**
 * @TODO button icons
 */
export const Pagination = createBlockComponent(styles, Component);

function Component({
  commonTranslation,
  pagination,
  buildURL,
  ...props
}: IPaginationProps) {
  const { first, previous, current, next, last } = commonTranslation.pagination;
  const { currentPage, totalPages } = pagination;
  const buttonWidth = Math.max(
    first.length,
    previous.length,
    current.length,
    next.length,
    last.length,
  );

  return (
    <ul
      style={{ "--local-min-width": `${buttonWidth}em` } as CSSProperties}
      {...props}
    >
      <li className={styles.first}>
        {currentPage === 1 || currentPage === 0 ? (
          <span className={styles.disabled}>
            <span>|&lt;</span> <span>{first}</span>
          </span>
        ) : (
          <LinkButton href={buildURL(1)} className={styles.button}>
            <span>|&lt;</span> <span>{first}</span>
          </LinkButton>
        )}
      </li>

      <li className={styles.previous}>
        {currentPage - 1 <= 0 ? (
          <span className={styles.disabled}>
            <span>&lt;</span> <span>{previous}</span>
          </span>
        ) : (
          <LinkButton
            href={buildURL(currentPage - 1)}
            className={styles.button}
          >
            <span>&lt;</span> <span>{previous}</span>
          </LinkButton>
        )}
      </li>

      <li className={styles.current}>
        <PaginationOverview
          commonTranslation={commonTranslation}
          pagination={pagination}
        />
      </li>

      <li className={styles.next}>
        {currentPage + 1 >= totalPages + 1 ? (
          <span className={styles.disabled}>
            <span>&gt;</span> <span>{next}</span>
          </span>
        ) : (
          <LinkButton
            href={buildURL(currentPage + 1)}
            className={styles.button}
          >
            <span>&gt;</span> <span>{next}</span>
          </LinkButton>
        )}
      </li>
      <li className={styles.last}>
        {currentPage === totalPages ? (
          <span className={styles.disabled}>
            <span>&gt;|</span> <span>{last}</span>
          </span>
        ) : (
          <LinkButton href={buildURL(totalPages)} className={styles.button}>
            <span>&gt;|</span> <span>{last}</span>
          </LinkButton>
        )}
      </li>
    </ul>
  );
}
