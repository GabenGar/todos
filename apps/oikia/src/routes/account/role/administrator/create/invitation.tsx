import { nanoid } from "nanoid";
import { href } from "react-router";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { parseTitle } from "@repo/ui/entities";
import { type IFormData, parseStringValueFromFormData } from "@repo/ui/forms";
import {
  InputSectionDatetime,
  InputSectionInteger,
  InputSectionText,
} from "@repo/ui/forms/sections";
import { BIGINT_ONE } from "@repo/ui/numbers/bigint";
import { Page } from "@repo/ui/pages";
import { Form } from "#components/forms";
import { LinkInternal } from "#components/link";
import { runTransaction } from "#database";
import {
  type IInvitationDBInit,
  insertInvitations,
  selectInvitationEntities,
} from "#database/queries/invitations";
import { useTranslation } from "#hooks";
import { createMetaTitle } from "#lib/router";
import { createSuccessfullAPIResponse } from "#server/lib/api";
import { ClientInputError } from "#server/lib/errors";
import {
  authenticateAdmin,
  createLocalizedLoader,
  createServerAction,
  getLanguage,
  parseMethod,
} from "#server/lib/router";
import { getTranslation } from "#server/localization";
//

import type { Route } from "./+types/invitation";

/**
 * @TODO client render
 */
function InvitationCreatePage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language } = loaderData;
  const heading = t((t) => t.pages["create-invitation"]["Create Invitation"]);
  const formID = "create-invitation";
  const title = createMetaTitle(
    t((t) => t.pages["create-invitation"]["Create invitation"]),
  );

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <Form<Route.ComponentProps["actionData"]>
                id={formID}
                method="POST"
                submitButton={() =>
                  t((t) => t.pages["create-invitation"]["Create"])
                }
                successElement={(_formID, data) => {
                  if (!data.is_successful) {
                    throw new Error(
                      t((t) => t.common["Success element is unsuccessful."]),
                    );
                  }

                  const { id, title } = data.data;
                  const parsedTitle = parseTitle(title);

                  return (
                    <p>
                      {t(
                        (t) =>
                          t.pages["create-invitation"][
                            "You have successfully created an invitation"
                          ],
                      )}{" "}
                      <LinkInternal
                        href={href(
                          "/:language/account/role/administrator/invitation/:id",
                          { language, id },
                        )}
                      >
                        {parsedTitle} ({id})
                      </LinkInternal>
                      .
                    </p>
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
                      {t((t) => t.pages["create-invitation"]["Title"])}
                    </InputSectionText>

                    <InputSectionText
                      id={`${formID}-description`}
                      form={formID}
                      name="description"
                    >
                      {t((t) => t.pages["create-invitation"]["Description"])}
                    </InputSectionText>

                    <InputSectionDatetime
                      id={`${formID}-expires_at`}
                      form={formID}
                      name="expires_at"
                    >
                      {t(
                        (t) => t.pages["create-invitation"]["Expiration date"],
                      )}
                    </InputSectionDatetime>

                    <InputSectionInteger
                      id={`${formID}-max_uses`}
                      form={formID}
                      name="max_uses"
                      min={BIGINT_ONE}
                    >
                      {t((t) => t.pages["create-invitation"]["Maximum uses"])}
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

export const loader = createLocalizedLoader();

export const action = createServerAction(
  async ({ request, params }: Route.LoaderArgs) => {
    const account = await authenticateAdmin(request);

    const language = getLanguage(params);
    const { pages } = await getTranslation(language);
    const translation = pages["create-invitation"];

    parseMethod(request, "POST");

    const formData = (await request.formData()) as IFormData<
      "expires_at" | "max_uses" | "title" | "description"
    >;

    const expiresAt = parseStringValueFromFormData(formData, "expires_at");
    const maxUses = parseStringValueFromFormData(formData, "max_uses");
    const title = parseStringValueFromFormData(formData, "title");
    const description = parseStringValueFromFormData(formData, "description");

    if (!expiresAt && !maxUses) {
      throw new ClientInputError(
        translation["Must have at least expiration date or maximum uses."],
      );
    }

    const invitation = await runTransaction(async (transaction) => {
      const createdBy = account.id;
      const code = nanoid();
      const init: IInvitationDBInit = {
        created_by: createdBy,
        code,
        target_role: "user",
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
  },
);

export default InvitationCreatePage;
