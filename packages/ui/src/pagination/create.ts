import { BIGINT_ONE, BIGINT_ZERO } from "#numbers/bigint";
import { PAGINATION_LIMIT, type IPagination } from "./types";

export function createPagination(
  totalCount: string,
  page?: string
): IPagination {
  const parsedTotalCount = BigInt(totalCount);
  // https://stackoverflow.com/a/66192429
  const isDivisible = parsedTotalCount % PAGINATION_LIMIT === BIGINT_ZERO;
  const totalPages = isDivisible
    ? parsedTotalCount / PAGINATION_LIMIT
    : parsedTotalCount / PAGINATION_LIMIT + BIGINT_ONE;
  const currentPage = page ? BigInt(page) : totalPages;

  if (currentPage > totalPages) {
    throw new Error(
      `Current page ${page} of total count ${totalCount} and limit ${PAGINATION_LIMIT} is greater than ${totalPages}.`
    );
  }

  const offset = (currentPage - BIGINT_ONE) * PAGINATION_LIMIT;
  const currentMin =
    parsedTotalCount === BIGINT_ZERO ? BIGINT_ZERO : offset + BIGINT_ONE;
  const currentMax =
    offset + PAGINATION_LIMIT > parsedTotalCount
      ? parsedTotalCount
      : offset + PAGINATION_LIMIT;

  const pagination: IPagination = {
    total_count: totalCount,
    total_pages: String(totalPages),
    current_page: String(currentPage),
    limit: String(PAGINATION_LIMIT),
    offset: String(offset),
    current_min: String(currentMin),
    current_max: String(currentMax),
  };

  return pagination;
}

export function createClientPagination(
  totalCount: string,
  limit: string,
  page?: string
): IPagination {
  const parsedTotalCount = BigInt(totalCount);
  const parsedLimit = BigInt(limit);
  // https://stackoverflow.com/a/66192429
  const isDivisible = parsedTotalCount % parsedLimit === BIGINT_ZERO;
  const totalPages = isDivisible
    ? parsedTotalCount / parsedLimit
    : parsedTotalCount / parsedLimit + BIGINT_ONE;
  const currentPage = page ? BigInt(page) : totalPages;

  if (currentPage > totalPages) {
    throw new Error(
      `Current page ${page} of total count ${totalCount} and limit ${limit} is greater than ${totalPages}.`
    );
  }

  const offset =
    currentPage - BIGINT_ONE < BIGINT_ZERO
      ? BIGINT_ZERO
      : (currentPage - BIGINT_ONE) * parsedLimit;
  const currentMin =
    parsedTotalCount === BIGINT_ZERO ? BIGINT_ZERO : offset + BIGINT_ONE;
  const currentMax =
    offset + parsedLimit > parsedTotalCount
      ? parsedTotalCount
      : offset + parsedLimit;

  const pagination: IPagination = {
    total_count: totalCount,
    total_pages: String(totalPages),
    current_page: String(currentPage),
    limit,
    offset: String(offset),
    current_min: String(currentMin),
    current_max: String(currentMax),
  };

  return pagination;
}
