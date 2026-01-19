import { useRef, useState, useEffect } from "react";
import { InputSection } from "@repo/ui/forms/sections";
import { InputHidden, InputTextArea } from "@repo/ui/forms/inputs";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionSection,
  DescriptionTerm,
} from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import type { ILocalizationPage } from "#lib/localization";
import { List, ListItem } from "@repo/ui/lists";
import { formDataToURLSearchParams } from "@repo/ui/forms";
import { Button } from "@repo/ui/buttons";
import type { ITranslatableProps } from "#components/types";
import { Form, type IFormEvent } from "#components/form";

import styles from "./search-params.module.scss";

interface IProps extends ITranslatableProps {
  t: ILocalizationPage["url-editor"];
  id: string;
  formID: string;
  name: string;
  defaultValue: string | undefined;
}

export function SearchParams({
  commonTranslation,
  t,
  id,
  formID,
  name,
  defaultValue,
}: IProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentSearchParams, changeCurrentSearchParams] = useState(() => {
    if (inputRef.current) {
      inputRef.current.value = defaultValue ?? "";
    }
    return new URLSearchParams(defaultValue);
  });
  const editFormID = `${id}-edit-params`;
  const isEmptySearchParams = currentSearchParams.size === 0;
  const paramKeys = Array.from(currentSearchParams.keys());

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = defaultValue ?? "";
    }

    changeCurrentSearchParams(new URLSearchParams(defaultValue));
  }, [defaultValue]);

  async function handleSearchParamsChange(event: IFormEvent<string>) {
    const formData = new FormData(event.currentTarget);
    const searchParams = formDataToURLSearchParams(formData);

    changeCurrentSearchParams(searchParams);

    if (inputRef.current) {
      inputRef.current.value = String(searchParams);
    }
  }

  async function handleKeyDeletion(paramKey: string) {
    const nextParams = new URLSearchParams(currentSearchParams);

    nextParams.delete(paramKey);

    changeCurrentSearchParams(nextParams);
  }

  async function handleValueDeletion(paramKey: string, index: number) {
    const nextParams = new URLSearchParams(currentSearchParams);
    // we are not using two-argument of `URLSearchParams.delete()`
    // because it deletes by the value, including duplicates
    // but we only want to delete a single value at specific index
    const currentValues = nextParams
      .getAll(paramKey)
      .filter((_, currentIndex) => currentIndex !== index);

    if (currentValues.length === 0) {
      nextParams.delete(paramKey);
    } else {
      currentValues.forEach((value, index) => {
        // overwrite the key at the first value
        // because I assume deleting the key and appending to it
        // will change the order of the key in the view
        if (index === 0) {
          nextParams.set(paramKey, value);

          return;
        }

        nextParams.append(paramKey, value);
      });
    }

    changeCurrentSearchParams(nextParams);
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
            >
              <Form
                commonTranslation={commonTranslation}
                id={editFormID}
                isNested
                submitButton={(_, isSubmitting) =>
                  isSubmitting
                    ? commonTranslation.form["Applying changes..."]
                    : commonTranslation.form["Confirm changes"]
                }
                onSubmit={handleSearchParamsChange}
              >
                {(formID) =>
                  paramKeys.map((paramKey) => {
                    const values = currentSearchParams.getAll(paramKey);

                    return (
                      <ParamKey
                        key={paramKey}
                        formID={formID}
                        t={t}
                        paramKey={paramKey}
                        values={values}
                        onKeyDelete={handleKeyDeletion}
                        onValueDelete={handleValueDeletion}
                      />
                    );
                  })
                }
              </Form>
            </Details>
          }
        />
      </DescriptionList>
    </InputSection>
  );
}

interface IParamKeyProps extends Pick<IProps, "t"> {
  paramKey: string;
  values: string[];
  formID: string;
  onKeyDelete: (paramKey: string) => Promise<void>;
  onValueDelete: (paramKey: string, index: number) => Promise<void>;
}

function ParamKey({
  t,
  formID,
  paramKey,
  values,
  onKeyDelete,
  onValueDelete,
}: IParamKeyProps) {
  return (
    <DescriptionList>
      <DescriptionSection>
        <DescriptionTerm className={styles.key}>
          <Preformatted>{paramKey}:</Preformatted>
          <Button onClick={async () => onKeyDelete(paramKey)}>
            {t["Delete"]}
          </Button>
        </DescriptionTerm>

        <DescriptionDetails>
          <Details
            summary={
              <>
                {t["Values"]}: <Preformatted>{values.length}</Preformatted>
              </>
            }
          >
            <List isOrdered isNested>
              {values.map((value, index) => (
                <ListItem key={`${paramKey}-${value}-${index}`}>
                  <InputTextArea
                    id={`${formID}-${paramKey}-${value}-${index}`}
                    className={styles.value}
                    name={paramKey}
                    form={formID}
                    rows={1}
                    defaultValue={value}
                  />
                  <Button
                    className={styles.delete}
                    onClick={() => onValueDelete(paramKey, index)}
                  >
                    {t["Delete"]}
                  </Button>
                </ListItem>
              ))}
            </List>
          </Details>
        </DescriptionDetails>
      </DescriptionSection>
    </DescriptionList>
  );
}
