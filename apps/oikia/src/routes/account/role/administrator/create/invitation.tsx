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
import { parseTitle } from "@repo/ui/entities";
import type { ICommonTranslationPageProps } from "#lib/internationalization";
import { createMetaTitle } from "#lib/router";
import {
  authenticateAdmin,
  createServerAction,
  getLanguage,
  parseMethod,
} from "#server/lib/router";
import { ClientInputError } from "#server/lib/errors";
import { createSuccessfullAPIResponse } from "#server/lib/api";
import { getTranslation } from "#server/localization";
import { runTransaction } from "#database";
import {
  insertInvitations,
  selectInvitationEntities,
  type IInvitationDBInit,
} from "#database/queries/invitations";
import { Form } from "#components/forms";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/invitation";

interface IProps extends ICommonTranslationPageProps<"create-invitation"> {}

export function meta({ data }: Route.MetaArgs) {
  // @ts-expect-error cannot fetch translaction
  const { translation } = data;
  const title = createMetaTitle(translation["Create invitation"]);

  return [{ title }];
}

/**
 * @TODO client render
 */
function InvitationCreatePage({ loaderData }: Route.ComponentProps) {
  const { language, commonTranslation, translation } = loaderData;
  const heading = translation["Create Invitation"];
  const formID = "create-invitation";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <Form<Route.ComponentProps["actionData"]>
                commonTranslation={commonTranslation}
                id={formID}
                method="POST"
                submitButton={() => translation["Create"]}
                successElement={(_formID, data) => {
                  if (!data.is_successful) {
                    throw new Error(
                      commonTranslation["Success element is unsuccessful."],
                    );
                  }

                  const { id, title } = data.data;
                  const parsedTitle = parseTitle(title);

                  return (
                    <p>
                      {
                        translation[
                          "You have successfully created an invitation"
                        ]
                      }{" "}
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
                      {translation["Title"]}
                    </InputSectionText>

                    <InputSectionText
                      id={`${formID}-description`}
                      form={formID}
                      name="description"
                    >
                      {translation["Description"]}
                    </InputSectionText>

                    <InputSectionDatetime
                      id={`${formID}-expires_at`}
                      form={formID}
                      name="expires_at"
                    >
                      {translation["Expiration date"]}
                    </InputSectionDatetime>

                    <InputSectionInteger
                      id={`${formID}-max_uses`}
                      form={formID}
                      name="max_uses"
                      min={BIGINT_ONE}
                    >
                      {translation["Maximum uses"]}
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

export async function loader({ request, params }: Route.LoaderArgs) {
  await authenticateAdmin(request);

  const language = getLanguage(params);
  const { common: commonTranslation, pages } = await getTranslation(language);
  const translation = pages["create-invitation"];

  const props: IProps = {
    language,
    commonTranslation,
    translation,
  };

  return props;
}

export const action = createServerAction(
  async ({ request, params }: Route.LoaderArgs) => {
    const account = await authenticateAdmin(request);

    const language = getLanguage(params);
    const { common: commonTranslation, pages } = await getTranslation(language);
    const translation = pages["create-invitation"];

    parseMethod(request, "POST", commonTranslation);

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
