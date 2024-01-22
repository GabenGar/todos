import type { INonNegativeInteger } from "#lib/numbers";

export interface IPagination {
  totalCount: INonNegativeInteger;
  currentPage: INonNegativeInteger;
  currentMin: INonNegativeInteger;
  currentMax: INonNegativeInteger;
  totalPages: INonNegativeInteger;
  limit: INonNegativeInteger;
  /**
   * An offset value to use for zero-based collections
   * such as arrays.
   */
  offset: INonNegativeInteger;
}

export interface IPaginatedCollection<ItemType> {
  pagination: IPagination;
  items: ItemType[];
}

export const PAGINATION_LIMIT = 25;
