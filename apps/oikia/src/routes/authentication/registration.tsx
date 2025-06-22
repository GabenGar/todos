import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { parseStringValueFromFormData } from "@repo/ui/forms";
import {
  InputSectionNanoID,
  InputSectionPassword,
  InputSectionText,
} from "@repo/ui/forms/sections";
import type { ICommonTranslationPageProps } from "#lib/internationalization";
import { createMetaTitle } from "#lib/router";
import {
  createServerAction,
  getLanguage,
  parseMethod,
} from "#server/lib/router";
import { ClientInputError } from "#server/lib/errors";
import { runTransaction } from "#database";
import { getTranslation } from "#server/localization";
import { registerAccount } from "#server/entities/accounts";
import { LinkInternal } from "#components/link";
import { Form } from "#components/forms";
import type { IAccountInit } from "#entities/account";

import type { Route } from "./+types/registration";

interface IProps extends ICommonTranslationPageProps<"registration"> {}

export function meta({ data }: Route.MetaArgs) {
  const { translation } = data;
  const title = createMetaTitle(translation["Registration"]);

  return [{ title }];
}

function RegistrationPage({ loaderData }: Route.ComponentProps) {
  const { language, commonTranslation, translation } = loaderData;
  const heading = translation["Registration"];
  const formID = "registration";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <p>
                {translation["Already registered?"]}{" "}
                <LinkInternal
                  href={href("/:language/authentication/login", { language })}
                >
                  {translation["Log in."]}
                </LinkInternal>
              </p>
            </OverviewHeader>

            <OverviewBody>
              <Form<Route.ComponentProps["actionData"]>
                commonTranslation={commonTranslation}
                id={formID}
                method="POST"
                submitButton={() => translation["Register"]}
                resetButton={null}
                successElement={(formID, data) => (
                  <>
                    <p>
                      {
                        translation[
                          "You have successfully created an account, now you can"
                        ]
                      }{" "}
                      <LinkInternal
                        href={href("/:language/authentication/login", {
                          language,
                        })}
                      >
                        {translation["log in"]}
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
                      {translation["Login"]}
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
                      {translation["Password"]}
                    </InputSectionPassword>

                    <InputSectionNanoID
                      id={`${formID}-invitation-code`}
                      form={formID}
                      name="invitation_code"
                      required
                    >
                      {translation["Invitation code"]}
                    </InputSectionNanoID>

                    <InputSectionText
                      id={`${formID}-name`}
                      form={formID}
                      name="name"
                      minLength={1}
                      maxLength={128}
                    >
                      {translation["Display name"]}
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

export async function loader({ params }: Route.LoaderArgs) {
  const language = getLanguage(params);
  const { common: commonTranslation, pages } = await getTranslation(language);
  const translation = pages.registration;

  const props: IProps = {
    language,
    commonTranslation,
    translation,
  };

  return props;
}

export const action = createServerAction(
  async ({ request, params }: Route.ActionArgs) => {
    const language = getLanguage(params);
    const { common: commonTranslation, pages } = await getTranslation(language);
    const translation = pages.registration;

    parseMethod(request, "POST", commonTranslation);

    const formData = await request.formData();

    let login: string | undefined = undefined;
    {
      const value = parseStringValueFromFormData(formData, "login");

      if (!value) {
        throw new ClientInputError(translation["Login is required."]);
      }

      if (value.length < 5 && value.length > 20) {
        throw new ClientInputError(translation["Invalid login length."]);
      }

      login = value;
    }

    let password: string | undefined = undefined;
    {
      const value = parseStringValueFromFormData(formData, "password");

      if (!value) {
        throw new ClientInputError(translation["Password is required."]);
      }

      if (value.length < 8 && value.length > 49) {
        throw new ClientInputError(translation["Invalid password length."]);
      }

      password = value;
    }

    let invitation_code: string | undefined = undefined;
    {
      const value = parseStringValueFromFormData(formData, "invitation_code");

      if (!value) {
        throw new ClientInputError(translation["Invitation code is required."]);
      }

      if (value.length !== 21) {
        throw new ClientInputError(
          translation["Invalid invitation code length."],
        );
      }

      invitation_code = value;
    }

    const name = parseStringValueFromFormData(formData, "name");

    if (name && (name.length < 1 || name.length > 128)) {
      throw new ClientInputError(translation["Invalid display name length."]);
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
