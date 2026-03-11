import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import { usePageTranslation } from "#hooks";
import type { IBaseURLFormProps } from "./base";
import { Hash } from "./hash";
import { Origin } from "./origin";
import { Pathname } from "./pathname";
import { SearchParams } from "./search-params";

interface IURLEditorFormProps extends IFormComponentProps {
  baseURL: Parameters<IBaseURLFormProps["onNewURL"]>[0];
  onNewURL: (newURL: URL) => Promise<void>;
}

export function URLEditorForm({ id, baseURL, onNewURL }: IURLEditorFormProps) {
  const { t } = usePageTranslation("page-url-edit");
  const FIELD = {
    ORIGIN: { name: "origin", label: t((t) => t["Origin"]) },
    PATHNAME: { name: "pathname", label: t((t) => t["Pathname"]) },
    SEARCHPARAMS: {
      name: "search-params",
      label: t((t) => t["Search parameters"]),
    },
    HASH: { name: "hash", label: t((t) => t["Hash"]) },
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
      id={id}
      submitButton={(_formID, isSubmitting) =>
        t((t) => (!isSubmitting ? t["Parse"] : t["Parsing..."]))
      }
      onSubmit={handleSubmit}
      isResetOnSuccess={false}
    >
      {(formID) => (
        <>
          <Origin
            id={`${formID}-${FIELD.ORIGIN.name}`}
            formID={formID}
            name={FIELD.ORIGIN.name}
            defaultValue={baseOrigin}
          />

          <Pathname
            id={`${formID}-${FIELD.PATHNAME.name}`}
            formID={formID}
            name={FIELD.PATHNAME.name}
            defaultValue={basePath}
          />

          <SearchParams
            id={`${formID}-${FIELD.SEARCHPARAMS.name}`}
            formID={formID}
            name={FIELD.SEARCHPARAMS.name}
            defaultValue={baseSearchParams}
          />

          <Hash
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
