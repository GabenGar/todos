import { nanoid } from "nanoid";
import { createRequestHandler } from "@react-router/express";
import express from "express";
import { BIGINT_ONE, BIGINT_ZERO } from "@repo/ui/numbers/bigint";
import { now } from "@repo/ui/dates";
import { IS_DEVELOPMENT } from "#environment";
import { runStrictTransaction, type ITransaction } from "#database";
import { selectAccountCount } from "#database/queries/accounts";
import {
  insertInvitations,
  selectInvitationCount,
  type IInvitationDBInit,
} from "#database/queries/invitations";

import "react-router";

declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
  }
}

export async function createApp() {
  await runStrictTransaction(async (transaction) => {
    await handleAdminInvitation(transaction);
  });

  const app = express();

  app.use(
    createRequestHandler({
      // @ts-expect-error - virtual module provided by React Router at build time
      build: () => import("virtual:react-router/server-build"),
      async getLoadContext(req, res) {
        return {
          VALUE_FROM_EXPRESS: "Hello from Express",
        };
      },
    })
  );

  return app;
}

async function handleAdminInvitation(transaction: ITransaction) {
  const adminCount = await selectAccountCount(transaction, {
    role: "administrator",
  });
  const parsedAdminCount = BigInt(adminCount);

  if (parsedAdminCount !== BIGINT_ZERO) {
    return;
  }

  const expiresAt = now();
  const invitationCount = await selectInvitationCount(transaction, {
    target_role: "administrator",
    is_active: true,
    expires_at: expiresAt,
  });

  const parsedInvitationCount = BigInt(invitationCount);

  if (parsedInvitationCount !== BIGINT_ZERO) {
    return;
  }

  console.log(
    "No administrators and active administrator invitations present, creating an invitation for one..."
  );

  const code = IS_DEVELOPMENT ? "YFXWgDSa4V5nuHZJeAYcj" : nanoid();

  const init: IInvitationDBInit = {
    code,
    target_role: "administrator",
    max_uses: String(BIGINT_ONE),
    title: "Admin system invitation",
    description: "tfw no admin",
  };

  await insertInvitations(transaction, [init]);

  console.log("Successfuly created an invitation for administrator.");
}
