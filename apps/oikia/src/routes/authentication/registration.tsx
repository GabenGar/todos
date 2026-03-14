import { href } from "react-router";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { parseStringValueFromFormData } from "@repo/ui/forms";
import {
  InputSectionNanoID,
  InputSectionPassword,
  InputSectionText,
} from "@repo/ui/forms/sections";
import { Page } from "@repo/ui/pages";
import { Form } from "#components/forms";
import { LinkInternal } from "#components/link";
import { runTransaction } from "#database";
import type { IAccountInit } from "#entities/account";
import { useTranslation } from "#hooks";
import { createMetaTitle } from "#lib/router";
import { registerAccount } from "#server/entities/accounts";
import { ClientInputError } from "#server/lib/errors";
import {
  createLocalizedLoader,
  createServerAction,
  parseMethod,
} from "#server/lib/router";
//

import type { Route } from "./+types/registration";

function RegistrationPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language } = loaderData;
  const title = createMetaTitle(t((t) => t.pages.registration["Registration"]));
  const heading = t((t) => t.pages.registration["Registration"]);
  const formID = "registration";

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <p>
                {t((t) => t.pages.registration["Already registered?"])}{" "}
                <LinkInternal
                  href={href("/:language/authentication/login", { language })}
                >
                  {t((t) => t.pages.registration["Log in."])}
                </LinkInternal>
              </p>
            </OverviewHeader>

            <OverviewBody>
              <Form<Route.ComponentProps["actionData"]>
                id={formID}
                method="POST"
                submitButton={() => t((t) => t.pages.registration["Register"])}
                resetButton={null}
                successElement={() => (
                  <>
                    <p>
                      {t(
                        (t) =>
                          t.pages.registration[
                            "You have successfully created an account, now you can"
                          ],
                      )}{" "}
                      <LinkInternal
                        href={href("/:language/authentication/login", {
                          language,
                        })}
                      >
                        {t((t) => t.pages.registration["log in"])}
                      </LinkInternal>
                      .
                    </p>
                  </>
                )}
              >
                {(formID) => (
                  <>
                    <InputSectionText
                      id={`${formID}-login`}
                      form={formID}
                      name="login"
                      minLength={5}
                      maxLength={20}
                      required
                    >
                      {t((t) => t.pages.registration["Login"])}
                    </InputSectionText>

                    <InputSectionPassword
                      id={`${formID}-password`}
                      form={formID}
                      name="password"
                      autoComplete="new-password"
                      minLength={8}
                      // https://security.stackexchange.com/q/39849
                      maxLength={49}
                      required
                    >
                      {t((t) => t.pages.registration["Password"])}
                    </InputSectionPassword>

                    <InputSectionNanoID
                      id={`${formID}-invitation-code`}
                      form={formID}
                      name="invitation_code"
                      required
                    >
                      {t((t) => t.pages.registration["Invitation code"])}
                    </InputSectionNanoID>

                    <InputSectionText
                      id={`${formID}-name`}
                      form={formID}
                      name="name"
                      minLength={1}
                      maxLength={128}
                    >
                      {t((t) => t.pages.registration["Display name"])}
                    </InputSectionText>
                  </>
                )}
              </Form>
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export const loader = createLocalizedLoader();

export const action = createServerAction(
  async ({ request, params }: Route.ActionArgs) => {
    parseMethod(request, "POST");

    const formData = await request.formData();

    let login: string | undefined = undefined;
    {
      const value = parseStringValueFromFormData(formData, "login");

      if (!value) {
        throw new ClientInputError("Login is required.");
      }

      if (value.length < 5 && value.length > 20) {
        throw new ClientInputError("Invalid login length.");
      }

      login = value;
    }

    let password: string | undefined = undefined;
    {
      const value = parseStringValueFromFormData(formData, "password");

      if (!value) {
        throw new ClientInputError("Password is required.");
      }

      if (value.length < 8 && value.length > 49) {
        throw new ClientInputError("Invalid password length.");
      }

      password = value;
    }

    let invitation_code: string | undefined = undefined;
    {
      const value = parseStringValueFromFormData(formData, "invitation_code");

      if (!value) {
        throw new ClientInputError("Invitation code is required.");
      }

      if (value.length !== 21) {
        throw new ClientInputError("Invalid invitation code length.");
      }

      invitation_code = value;
    }

    const name = parseStringValueFromFormData(formData, "name");

    if (name && (name.length < 1 || name.length > 128)) {
      throw new ClientInputError("Invalid display name length.");
    }

    const accountInit: IAccountInit = {
      login,
      password,
      invitation_code,
      name,
    };

    await runTransaction(
      async (transaction) => await registerAccount(transaction, accountInit),
    );

    return true;
  },
);

export default RegistrationPage;
