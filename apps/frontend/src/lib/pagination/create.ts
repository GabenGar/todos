import { PAGINATION_LIMIT, type IPagination } from "./types";

export function createPagination(
  totalCount: number,
  page?: number,
): IPagination {
  const totalPages = Math.ceil(totalCount / PAGINATION_LIMIT);
  const currentPage = page ?? totalPages;

  if (totalPages !== 0 && currentPage > totalPages) {
    throw new Error(
      `Current page ${page} of total count ${totalCount} and limit ${PAGINATION_LIMIT} is greater than ${totalPages}.`,
    );
  }

  const offset = (currentPage - 1) * PAGINATION_LIMIT;
  const currentMin = totalCount === 0 ? 0 : offset + 1;
  const currentMax =
    offset + PAGINATION_LIMIT > totalCount
      ? totalCount
      : offset + PAGINATION_LIMIT;

  const pagination: IPagination = {
    totalCount,
    totalPages,
    currentPage,
    limit: PAGINATION_LIMIT,
    offset,
    currentMin,
    currentMax,
  };

  return pagination;
}

export function createClientPagination(
  totalCount: number,
  limit: number,
  page?: number,
): IPagination {
  const totalPages = Math.ceil(totalCount / limit);
  const currentPage = page ?? totalPages;

  if (totalPages !== 0 && currentPage > totalPages) {
    throw new Error(
      `Current page ${page} of total count ${totalCount} and limit ${limit} is greater than ${totalPages}.`,
    );
  }

  const offset = currentPage - 1 < 0 ? 0 : (currentPage - 1) * limit;
  const currentMin = totalCount === 0 ? 0 : offset + 1;
  const currentMax = offset + limit > totalCount ? totalCount : offset + limit;

  const pagination: IPagination = {
    totalCount,
    totalPages,
    currentPage,
    limit,
    offset,
    currentMin,
    currentMax,
  };

  return pagination;
}
