import { href } from "react-router";
import { nanoid } from "nanoid";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { parseStringValueFromFormData, type IFormData } from "@repo/ui/forms";
import {
  InputSectionDatetime,
  InputSectionInteger,
  InputSectionText,
} from "@repo/ui/forms/sections";
import { BIGINT_ONE } from "@repo/ui/numbers/bigint";
import { NotImplementedError } from "@repo/ui/errors";
import {
  authenticateAdmin,
  createServerAction,
  parseMethod,
} from "#server/lib/router";
import { ClientError } from "#server/lib/errors";
import { createSuccessfullAPIResponse } from "#server/lib/api";
import { runTransaction } from "#database";
import {
  insertInvitations,
  selectInvitationEntities,
  type IInvitationDBInit,
} from "#database/queries/invitations";
import { Form } from "#components/forms";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/invitation";

export function meta(args: Route.MetaArgs) {
  return [{ title: "Create invitation" }];
}

/**
 * @TODO client render
 */
function InvitationCreatePage(props: Route.ComponentProps) {
  const heading = "Create Invitation";
  const formID = "create-invitation";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Form<Route.ComponentProps["actionData"]>
                id={formID}
                method="POST"
                submitButton={() => "Create"}
                successElement={(formID, data) => {
                  if (!data.is_successful) {
                    throw new Error("Success element is unsuccessful.");
                  }

                  const { id, title } = data.data;

                  return (
                    <>
                      <p>
                        You have successfully created an invitation{" "}
                        <LinkInternal
                          href={href(
                            "/account/role/administrator/invitation/:id",
                            { id }
                          )}
                        >
                          {title ? `"${title}"` : "Untitled"} ({id})
                        </LinkInternal>
                        .
                      </p>
                    </>
                  );
                }}
              >
                {(formID) => (
                  <>
                    <InputSectionText
                      id={`${formID}-title`}
                      form={formID}
                      name="title"
                    >
                      Title
                    </InputSectionText>

                    <InputSectionText
                      id={`${formID}-description`}
                      form={formID}
                      name="description"
                    >
                      Description
                    </InputSectionText>

                    <InputSectionDatetime
                      id={`${formID}-expires_at`}
                      form={formID}
                      name="expires_at"
                    >
                      Expiration date
                    </InputSectionDatetime>

                    <InputSectionInteger
                      id={`${formID}-max_uses`}
                      form={formID}
                      name="max_uses"
                      min={BIGINT_ONE}
                    >
                      Maximum uses
                    </InputSectionInteger>
                  </>
                )}
              </Form>
            </OverviewHeader>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  await authenticateAdmin(request);
}

export const action = createServerAction(
  async ({ request }: Route.LoaderArgs) => {
    const account = await authenticateAdmin(request);

    parseMethod(request, "POST");

    const formData = (await request.formData()) as IFormData<
      "expires_at" | "max_uses" | "title" | "description"
    >;

    const expiresAt = parseStringValueFromFormData(formData, "expires_at");
    const maxUses = parseStringValueFromFormData(formData, "max_uses");
    const title = parseStringValueFromFormData(formData, "title");
    const description = parseStringValueFromFormData(formData, "description");

    if (!expiresAt && !maxUses) {
      throw new ClientError(
        "Must have at least expiration date or maximum uses."
      );
    }

    throw new NotImplementedError();

    const invitation = await runTransaction(async (transaction) => {
      const createdBy = account.id;
      const code = nanoid();
      const init: IInvitationDBInit = {
        created_by: createdBy,
        code,
        expires_at: expiresAt,
        max_uses: maxUses,
        title,
        description,
      };

      const [id] = await insertInvitations(transaction, [init]);
      const [invitation] = await selectInvitationEntities(transaction, [id]);

      return invitation;
    });

    const response = createSuccessfullAPIResponse(invitation);

    return response;
  }
);

export default InvitationCreatePage;
