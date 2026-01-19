import { useEffect, useRef } from "react";
import { InputSectionText } from "@repo/ui/forms/sections";
import { type ILocalizationPage } from "#lib/localization";
import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import type { ITranslatableProps } from "#components/types";
import type { IBaseURLFormProps } from "./base";
import { Origin } from "./origin";
import { SearchParams } from "./search-params";
import { Pathname } from "./pathname";
import { Hash } from "./hash";

interface IURLEditorFormProps extends ITranslatableProps, IFormComponentProps {
  t: ILocalizationPage["url-editor"];
  baseURL: Parameters<IBaseURLFormProps["onNewURL"]>[0];
  onNewURL: (newURL: URL) => Promise<void>;
}
export function URLEditorForm({
  commonTranslation,
  t,
  id,
  baseURL,
  onNewURL,
}: IURLEditorFormProps) {
  const FIELD = {
    ORIGIN: { name: "origin", label: t["Origin"] },
    PATHNAME: { name: "pathname", label: t["Pathname"] },
    SEARCHPARAMS: {
      name: "search-params",
      label: t["Search parameters"],
    },
    HASH: { name: "hash", label: t["Hash"] },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];
  const baseOrigin = baseURL === true ? undefined : baseURL.origin;
  const basePath = baseURL === true ? undefined : baseURL.pathname;
  const baseSearchParams = baseURL === true ? undefined : baseURL.search;
  const baseHash = baseURL === true ? undefined : baseURL.hash.slice(1);

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const elements = event.currentTarget.elements;
    const origin = elements.origin.value;
    const pathname = elements.pathname.value;
    const normalizedPathname = pathname.slice(pathname.startsWith("/") ? 1 : 0);
    const searchParams = elements["search-params"].value;
    const hash = elements.hash.value;

    const finalURL = new URL(
      `${origin}/${normalizedPathname}${searchParams}${!hash ? "" : `#${hash}`}`,
    );

    onNewURL(finalURL);
  }

  return (
    <Form<IFieldName>
      commonTranslation={commonTranslation}
      id={id}
      submitButton={(formID, isSubmitting) =>
        !isSubmitting ? t["Parse"] : t["Parsing..."]
      }
      onSubmit={handleSubmit}
      isResetOnSuccess={false}
    >
      {(formID) => (
        <>
          <Origin
            commonTranslation={commonTranslation}
            t={t}
            id={`${formID}-${FIELD.ORIGIN.name}`}
            formID={formID}
            name={FIELD.ORIGIN.name}
            defaultValue={baseOrigin}
          />

          <Pathname
            commonTranslation={commonTranslation}
            t={t}
            id={`${formID}-${FIELD.PATHNAME.name}`}
            formID={formID}
            name={FIELD.PATHNAME.name}
            defaultValue={basePath}
          />

          <SearchParams
            commonTranslation={commonTranslation}
            t={t}
            id={`${formID}-${FIELD.SEARCHPARAMS.name}`}
            formID={formID}
            name={FIELD.SEARCHPARAMS.name}
            defaultValue={baseSearchParams}
          />

          <Hash
            commonTranslation={commonTranslation}
            t={t}
            id={`${formID}-${FIELD.HASH.name}`}
            formID={formID}
            name={FIELD.HASH.name}
            label={FIELD.HASH.label}
            defaultValue={baseHash}
          />
        </>
      )}
    </Form>
  );
}
