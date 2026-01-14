import { useRef, useState, useEffect } from "react";
import { InputSection } from "@repo/ui/forms/sections";
import { InputHidden } from "@repo/ui/forms/inputs";
import { NotImplementedError } from "@repo/ui/errors";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import type { ILocalizationPage } from "#lib/localization";
import type { ITranslatableProps } from "#components/types";
import type { IFormEvent } from "#components/form";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";

interface IProps extends ITranslatableProps {
  t: ILocalizationPage["url-editor"];
  id: string;
  formID: string;
  name: string;
  defaultValue: string | undefined;
}

export function SearchParams({ t, id, formID, name, defaultValue }: IProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentSearchParams, changeCurrentSearchParams] = useState(() => {
    if (inputRef.current) {
      inputRef.current.value = defaultValue ?? "";
    }
    return new URLSearchParams(defaultValue);
  });
  const isEmptySearchParams = currentSearchParams.size === 0;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = defaultValue ?? "";
    }

    changeCurrentSearchParams(new URLSearchParams(defaultValue));
  }, [defaultValue]);

  async function handleSearchParamsChange(event: IFormEvent<string>) {
    throw new NotImplementedError();
  }
  return (
    <InputSection>
      <InputHidden ref={inputRef} form={formID} name={name} />
      <DescriptionList>
        <DescriptionSection
          dKey={t["Search parameters"]}
          dValue={
            <Details
              summary={
                isEmptySearchParams ? (
                  t["Empty"]
                ) : (
                  <>
                    {t["Keys"]}:{" "}
                    <Preformatted>{currentSearchParams.size}</Preformatted>
                  </>
                )
              }
            ></Details>
          }
        />
      </DescriptionList>
    </InputSection>
  );
}
