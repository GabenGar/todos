import {
  getQueryFile,
  toEntityIDs,
  type IEntityRow,
  type IPaginatedFilter,
  type ITransaction,
} from "#database";
import type { IAccountDB } from "#database/queries/accounts";
import type { IInvitationDB } from "../types";

const query = getQueryFile("invitations", "accounts", "ids.sql");

interface IFilter extends IPaginatedFilter {
  invitation_id: IInvitationDB["id"];
}

export async function selectInvitedAccountIDs(
  transaction: ITransaction,
  filter: IFilter,
): Promise<IAccountDB["id"][]> {
  const { limit, offset } = filter.pagination;
  const params = {
    offset,
    limit,
    invitation_id: filter.invitation_id,
  };
  const result = await transaction.many<IEntityRow>(query, params);
  const ids = toEntityIDs(result);

  return ids;
}
