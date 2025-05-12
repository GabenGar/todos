export const PAGINATION_LIMIT = 25;

export interface IPagination {
  total_count: string;
  limit: string;
  offset: string;
}
