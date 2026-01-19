import { useRef, useState, useEffect } from "react";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { InputHidden, InputTextArea } from "@repo/ui/forms/inputs";
import { InputSection } from "@repo/ui/forms/sections";
import type { ILocalizationPage } from "#lib/localization";
import { Details } from "@repo/ui/details";
import { List, ListItem } from "@repo/ui/lists";
import { getPathnameSegments } from "@repo/ui/url";
import { Preformatted } from "@repo/ui/formatting";
import { Button } from "@repo/ui/buttons";
import type { ITranslatableProps } from "#components/types";
import { Form, type IFormEvent } from "#components/form";

import styles from "./pathname.module.scss";

interface IProps extends ITranslatableProps {
  t: ILocalizationPage["url-editor"];
  id: string;
  formID: string;
  name: string;
  defaultValue: string | undefined;
}

export function Pathname({
  commonTranslation,
  t,
  id,
  formID,
  name,
  defaultValue,
}: IProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentPathname, changeCurrentPathname] = useState(() => {
    if (inputRef.current) {
      inputRef.current.value = defaultValue ?? "";
    }
    return getPathnameSegments(defaultValue);
  });
  const FIELD = {
    SEGMENT: { name: "segment", label: t["Segment"] },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];
  const editFormID = `${id}-edit-path`;
  const isEmptyPath = !currentPathname || currentPathname.length === 0;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = defaultValue ?? "";
    }

    changeCurrentPathname(getPathnameSegments(defaultValue));
  }, [defaultValue]);

  function changePathname(nextPathName: string[]) {
    changeCurrentPathname(nextPathName);

    if (inputRef.current) {
      inputRef.current.value = nextPathName.join("/");
    }
  }

  async function handlePathnameChange(event: IFormEvent<IFieldName>) {
    const oneOrManySegments = event.currentTarget.elements.namedItem("segment");

    if (!oneOrManySegments) {
      changeCurrentPathname(undefined);
      return;
    }

    let nextPathname: string[];
    if (oneOrManySegments instanceof RadioNodeList) {
      nextPathname = (Array.from(oneOrManySegments) as HTMLInputElement[]).map(
        (input) => input.value,
      );
    } else {
      nextPathname = [(oneOrManySegments as HTMLInputElement).value];
    }

    changePathname(nextPathname);
  }

  return (
    <InputSection>
      <InputHidden ref={inputRef} form={formID} name={name} />
      <DescriptionList>
        <DescriptionSection
          dKey={t["Pathname"]}
          dValue={
            <Details
              summary={
                isEmptyPath ? (
                  t["Empty"]
                ) : (
                  <>
                    {t["Segments"]}:{" "}
                    <Preformatted>{currentPathname.length}</Preformatted>
                  </>
                )
              }
            >
              <Form<IFieldName>
                commonTranslation={commonTranslation}
                id={editFormID}
                isNested
                submitButton={(_, isSubmitting) =>
                  isSubmitting
                    ? commonTranslation.form["Applying changes..."]
                    : commonTranslation.form["Confirm changes"]
                }
                onSubmit={handlePathnameChange}
              >
                {(formID) =>
                  isEmptyPath ? undefined : (
                    <List isOrdered isNested>
                      {currentPathname.map((segment, index) => (
                        <ListItem key={`${index}-${segment}`}>
                          <InputTextArea
                            id={`${formID}-${FIELD.SEGMENT.name}`}
                            form={formID}
                            name={FIELD.SEGMENT.name}
                            defaultValue={segment}
                            rows={1}
                          />
                          <Button
                            className={styles.delete}
                            onClick={() => {
                              const nextPathname = currentPathname.reduce<
                                string[]
                              >((currentPath, segment, currentIndex) => {
                                if (currentIndex !== index) {
                                  currentPath.push(segment);
                                }

                                return currentPath;
                              }, []);

                              changePathname(nextPathname);
                            }}
                          >
                            {t["Delete"]}
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  )
                }
              </Form>
            </Details>
          }
        />
      </DescriptionList>
    </InputSection>
  );
}
