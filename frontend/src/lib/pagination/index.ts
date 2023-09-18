import type { IINTEGER } from "#lib/numbers";

export interface Pagination {
  totalCount: IINTEGER;
  currentPage: IINTEGER;
  totalPages: IINTEGER;
  limit: IINTEGER;
  /**
   * An offset value to use for zero-based collections
   * such as arrays.
   */
  offset: IINTEGER;
}

export const PAGINATION_LIMIT = 25;
export function createPagination(
  totalCount: number,
  page?: number,
): Pagination {
  const totalPages = Math.ceil(totalCount / PAGINATION_LIMIT);
  const currentPage = page ?? totalPages;

  if (currentPage > totalPages) {
    throw new Error(
      `Current page ${page} of total count ${totalCount} and limit ${PAGINATION_LIMIT} is greater than ${totalPages}.`,
    );
  }

  const offset = (currentPage - 1) * PAGINATION_LIMIT;

  const pagination: Pagination = {
    totalCount,
    totalPages,
    currentPage,
    limit: PAGINATION_LIMIT,
    offset,
  };

  return pagination;
}
