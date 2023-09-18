import type { CSSProperties } from "react";
import type { ILocalizationCommon } from "#lib/localization";
import type { IPagination } from "#lib/pagination";
import type { IBaseComponentProps } from "#components/types";
import { createBlockComponent } from "#components/meta";
import { LinkButton } from "#components/link";

import styles from "./pagination.module.scss";

interface IProps extends IBaseComponentProps<"ul"> {
  commonTranslation: ILocalizationCommon;
  pagination: IPagination;
  buildURL: (page: number) => string;
}

export const Pagination = createBlockComponent(styles, Component);

function Component({
  commonTranslation,
  pagination,
  buildURL,
  ...props
}: IProps) {
  const { first, previous, current, next, last } = commonTranslation.pagination;
  const { currentPage, currentMin, currentMax, totalPages } = pagination;
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
        <LinkButton href={buildURL(1)} className={styles.button}>
          {first}
        </LinkButton>
      </li>
      <li className={styles.previous}>
        <LinkButton href={buildURL(currentPage - 1)} className={styles.button}>
          {previous}
        </LinkButton>
      </li>
      <li className={styles.current}>
        {current}: {currentMin} - {currentMax}
      </li>
      <li className={styles.next}>
        <LinkButton href={buildURL(currentPage + 1)} className={styles.button}>
          {next}
        </LinkButton>
      </li>
      <li className={styles.last}>
        <LinkButton href={buildURL(totalPages)} className={styles.button}>
          {last}
        </LinkButton>
      </li>
    </ul>
  );
}
