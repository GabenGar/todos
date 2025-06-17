export interface IPagination {
  total_count: string;
  current_page: string;
  current_min: string;
  current_max: string;
  total_pages: string;
  limit: string;
  /**
   * An offset value to use for zero-based collections
   * such as arrays.
   */
  offset: string;
}

export interface IPaginatedCollection<ItemType> {
  pagination: IPagination;
  items: ItemType[];
}

export const PAGINATION_LIMIT = BigInt(25);
