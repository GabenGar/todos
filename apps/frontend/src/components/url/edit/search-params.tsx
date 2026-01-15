import { useRef, useState, useEffect } from "react";
import { InputSection } from "@repo/ui/forms/sections";
import { InputHidden, InputTextArea } from "@repo/ui/forms/inputs";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import type { ILocalizationPage } from "#lib/localization";
import { List, ListItem } from "@repo/ui/lists";
import { formDataToURLSearchParams } from "@repo/ui/forms";
import type { ITranslatableProps } from "#components/types";
import { Form, type IFormEvent } from "#components/form";

import styles from "./search-params.module.scss";
import { Button } from "@repo/ui/buttons";

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

  function changeSearchParams(nextSearchParams: URLSearchParams) {
    changeCurrentSearchParams(nextSearchParams)

    if (inputRef.current) {
      inputRef.current.value = String(nextSearchParams);
    }
  }

  async function handleSearchParamsChange(event: IFormEvent<string>) {
    const formData = new FormData(event.currentTarget);
    const searchParams = formDataToURLSearchParams(formData);

    changeCurrentSearchParams(searchParams);

    if (inputRef.current) {
      inputRef.current.value = String(searchParams);
    }
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
                submitButton={(_, isSubmitting) =>
                  isSubmitting ? t["Changing..."] : t["Change"]
                }
                onSubmit={handleSearchParamsChange}
              >
                {(formID) =>
                  paramKeys.map((paramKey) => {
                    const values = currentSearchParams.getAll(paramKey);

                    return (
                      <DescriptionList key={paramKey}>
                        <DescriptionSection
                          dKey={
                            <>
                              <Preformatted>{paramKey}</Preformatted>
                              <Button
                                onClick={() => {
                                  const nextParams = new URLSearchParams(
                                    currentSearchParams,
                                  );

                                  nextParams.delete(paramKey)

                                  changeSearchParams(nextParams)
                                }}


                              >
                                {t["Delete"]}
                              </Button>
                            </>
                          }
                          dValue={
                            <Details
                              summary={
                                <>
                                  {t["Values"]}:{" "}
                                  <Preformatted>{values.length}</Preformatted>
                                </>
                              }
                            >
                              <List isOrdered>
                                {values.map((value, index) => (
                                  <ListItem
                                    key={`${paramKey}-${value}-${index}`}
                                  >
                                    <InputTextArea
                                      id={`${formID}-${paramKey}-${value}-${index}`}
                                      className={styles.value}
                                      name={paramKey}
                                      form={formID}
                                      rows={1}
                                      defaultValue={value}
                                    />
                                    <Button onClick={() => {}}>
                                      {t["Delete"]}
                                    </Button>
                                  </ListItem>
                                ))}
                              </List>
                            </Details>
                          }
                        />
                      </DescriptionList>
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
