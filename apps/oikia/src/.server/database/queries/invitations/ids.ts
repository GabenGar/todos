import type { IPagination } from "#lib/pagination";
import {
  getQueryFile,
  toEntityIDs,
  type IEntityRow,
  type ITransaction,
} from "#database";
import type { IInvitationDB } from "./types";

const query = getQueryFile("invitations", "ids.sql");

interface IFilter {
  pagination: IPagination;
}

export async function selectInvitationIDs(
  transaction: ITransaction,
  filter: IFilter
): Promise<IInvitationDB["id"][]> {
  const { limit, offset } = filter.pagination;
  const params = {
    offset,
    limit,
  };
  const result = await transaction.many<IEntityRow>(query, params);
  const ids = toEntityIDs(result);

  return ids;
}
