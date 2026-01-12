import { useState } from "react";
import { NotImplementedError } from "@repo/ui/errors";
import { InputSectionText } from "@repo/ui/forms/sections";
import { type ILocalizationPage } from "#lib/localization";
import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import type { ITranslatableProps } from "#components/types";
import type { IBaseURLFormProps } from "./base";

interface IURLEditorFormProps extends ITranslatableProps, IFormComponentProps {
  translation: ILocalizationPage["url-editor"];
  baseURL: Parameters<IBaseURLFormProps["onNewURL"]>[0];
  onNewURL: (newURL: URL) => Promise<void>;
}
export function URLEditorForm({
  commonTranslation,
  translation,
  id,
  baseURL,
  onNewURL,
}: IURLEditorFormProps) {
  const FIELD = {
    PROTOCOL: { name: "protocol", label: translation["Protocol"] },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];
  const baseProtocol = baseURL === true ? undefined : baseURL.protocol;

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    throw new NotImplementedError();
  }

  return (
    <Form<IFieldName>
      commonTranslation={commonTranslation}
      id={id}
      submitButton={(formID, isSubmitting) =>
        !isSubmitting ? translation["Parse"] : translation["Parsing..."]
      }
      onSubmit={handleSubmit}
    >
      {(formID) => (
        <>
          <InputSectionText
            id={`${formID}-${FIELD.PROTOCOL.name}`}
            form={formID}
            name={FIELD.PROTOCOL.name}
            defaultValue={baseProtocol}
          >
            {FIELD.PROTOCOL.label}
          </InputSectionText>
        </>
      )}
    </Form>
  );
}
