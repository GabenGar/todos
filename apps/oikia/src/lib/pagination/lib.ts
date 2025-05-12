import { PAGINATION_LIMIT, type IPagination } from "./types";

export function createPagination(
  totalCount: string,
  offset: string,
): IPagination {
  const pagination: IPagination = {
    total_count: totalCount,
    limit: String(PAGINATION_LIMIT),
    offset: offset,
  };

  return pagination;
}
