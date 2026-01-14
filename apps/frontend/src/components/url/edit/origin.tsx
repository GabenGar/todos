import { useEffect, useRef, useState } from "react";
import { Details } from "@repo/ui/details";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Preformatted } from "@repo/ui/formatting";
import { InputSection, InputSectionText } from "@repo/ui/forms/sections";
import { InputHidden } from "@repo/ui/forms/inputs";
import type { ILocalizationPage } from "#lib/localization";
import { Form, type IFormEvent } from "#components/form";
import type { ITranslatableProps } from "#components/types";

interface IProps extends ITranslatableProps {
  t: ILocalizationPage["url-editor"];
  id: string;
  formID: string;
  name: string;
  defaultValue: string | undefined;
}

export function Origin({
  commonTranslation,
  t,
  id,
  formID,
  name,
  defaultValue,
}: IProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentOrigin, changeCurrentOrigin] = useState(() => {
    if (inputRef.current) {
      inputRef.current.value = defaultValue ?? "";
    }
    return defaultValue;
  });
  const FIELD = {
    PROTOCOL: { name: "protocol", label: t["Protocol"] },
    HOSTNAME: { name: "hostname", label: t["Hostname"] },
    PORT: { name: "port", label: t["Port"] },
    USERNAME: { name: "username", label: t["Username"] },
    PASSWORD: { name: "password", label: t["Password"] },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  const nestedFormID = `${id}-origin`;
  const originURL = !currentOrigin ? undefined : new URL(currentOrigin);
  const defaultProtocol = originURL?.protocol ?? "https:";
  const defaultHostname = originURL?.hostname;
  const defaultPort =
    originURL?.port ??
    (defaultProtocol === "https:" || defaultProtocol === "wss:"
      ? "443"
      : defaultProtocol === "http:" || defaultProtocol === "ws:"
        ? "80"
        : defaultProtocol === "ftp:"
          ? "21"
          : undefined);
  const defaultUsername = originURL?.username;
  const defaultPassword = originURL?.password;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = defaultValue ?? "";
    }

    changeCurrentOrigin(defaultValue);
  }, [defaultValue]);

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const inputs = event.currentTarget.elements;
    const protocol = inputs.protocol.value.trim();
    const username = inputs.username.value.trim();
    const password = inputs.password.value.trim();
    const hostname = inputs.hostname.value.trim();
    const port = inputs.port.value.trim();
    const creds = username || password ? `${username}:${password}` : undefined;
    const host = `${hostname}:${port}`;

    const origin = `${protocol}//${!creds ? host : `${creds}@${host}`}`;

    if (inputRef.current) {
      inputRef.current.value = origin;
      changeCurrentOrigin(origin);
    }
  }

  return (
    <InputSection>
      <InputHidden ref={inputRef} form={formID} name={name} />
      <DescriptionList>
        <DescriptionSection
          dKey={t["Origin"]}
          dValue={
            <Details
              summary={
                !currentOrigin ? (
                  t["Unknown"]
                ) : (
                  <Preformatted>{currentOrigin}</Preformatted>
                )
              }
            >
              <Form<IFieldName>
                id={nestedFormID}
                commonTranslation={commonTranslation}
                submitButton={(_, isSubmitting) =>
                  isSubmitting ? t["Changing..."] : t["Change"]
                }
                onSubmit={handleSubmit}
              >
                {(formID) => (
                  <>
                    <InputSectionText
                      id={`${formID}-${FIELD.PROTOCOL.name}`}
                      form={formID}
                      name={FIELD.PROTOCOL.name}
                      defaultValue={defaultProtocol}
                      rows={1}
                    >
                      {FIELD.PROTOCOL.label}
                    </InputSectionText>

                    <InputSectionText
                      id={`${formID}-${FIELD.HOSTNAME.name}`}
                      form={formID}
                      name={FIELD.HOSTNAME.name}
                      defaultValue={defaultHostname}
                    >
                      {FIELD.HOSTNAME.label}
                    </InputSectionText>

                    <InputSectionText
                      id={`${formID}-${FIELD.PORT.name}`}
                      form={formID}
                      name={FIELD.PORT.name}
                      defaultValue={defaultPort}
                      rows={1}
                    >
                      {FIELD.PORT.label}
                    </InputSectionText>

                    <InputSectionText
                      id={`${formID}-${FIELD.USERNAME.name}`}
                      form={formID}
                      name={FIELD.USERNAME.name}
                      defaultValue={defaultUsername}
                      rows={1}
                    >
                      {FIELD.USERNAME.label}
                    </InputSectionText>

                    <InputSectionText
                      id={`${formID}-${FIELD.PASSWORD.name}`}
                      form={formID}
                      name={FIELD.PASSWORD.name}
                      defaultValue={defaultPassword}
                      rows={1}
                    >
                      {FIELD.PASSWORD.label}
                    </InputSectionText>
                  </>
                )}
              </Form>
            </Details>
          }
        />
      </DescriptionList>
    </InputSection>
  );
}
