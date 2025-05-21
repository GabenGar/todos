import { getQueryFile, type ITransaction } from "#database";
import type { IInvitationDB } from "./types";

const query = getQueryFile("invitations", "entities.sql");

export async function selectInvitationEntities(
  transaction: ITransaction,
  ids: IInvitationDB["id"][]
): Promise<IInvitationDB[]> {
  const params = {
    ids,
  };

  if (ids.length === 1) {
    const invitation = await transaction.one<IInvitationDB>(query, params);

    return [invitation];
  }

  const invitations = await transaction.many<IInvitationDB>(query, params);

  if (invitations.length !== ids.length) {
    throw new Error(
      `The amount of output invitations ${invitations.length} does not match the amount of IDs provided ${ids.length}.`
    );
  }

  const resultInvitations = ids.map(
    (id) => invitations.find((invitation) => invitation.id === id)!
  );

  return resultInvitations;
}
