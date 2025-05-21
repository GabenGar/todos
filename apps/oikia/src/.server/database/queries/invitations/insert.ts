import {
  getQueryFile,
  toEntityIDs,
  type IEntityRow,
  type ITransaction,
} from "#database";
import type { IInvitationDB, IInvitationDBInit } from "./types";

const query = getQueryFile("invitations", "insert.sql");

export async function insertInvitations(
  transaction: ITransaction,
  inits: IInvitationDBInit[]
): Promise<IInvitationDB["id"][]> {
  const params = { inits };

  if (inits.length === 1) {
    const { id } = await transaction.one<IEntityRow>(query, params);

    return [id];
  }

  const results = await transaction.many<IEntityRow>(query, params);
  const ids = toEntityIDs(results);

  return ids;
}
