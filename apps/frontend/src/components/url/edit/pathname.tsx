import { useEffect, useRef, useState } from "react";
import { Button } from "@repo/ui/buttons";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import { InputHidden, InputTextArea } from "@repo/ui/forms/inputs";
import { InputSection } from "@repo/ui/forms/sections";
import { List, ListItem } from "@repo/ui/lists";
import { getPathnameSegments } from "@repo/ui/url";
import { Form, type IFormEvent } from "#components/form";
import { usePageTranslation, useTranslation } from "#hooks";
//

import styles from "./pathname.module.scss";

interface IProps {
  id: string;
  formID: string;
  name: string;
  defaultValue: string | undefined;
}

export function Pathname({ id, formID, name, defaultValue }: IProps) {
  const { t } = usePageTranslation("page-url-edit");
  const { t: cT } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentPathname, changeCurrentPathname] = useState(() => {
    if (inputRef.current) {
      inputRef.current.value = defaultValue ?? "";
    }
    return getPathnameSegments(defaultValue);
  });
  const FIELD = {
    SEGMENT: { name: "segment", label: t((t) => t["Segment"]) },
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
          dKey={t((t) => t["Pathname"])}
          dValue={
            <Details
              summary={
                isEmptyPath ? (
                  t((t) => t["Empty"])
                ) : (
                  <>
                    {t((t) => t["Segments"])}:{" "}
                    <Preformatted>{currentPathname.length}</Preformatted>
                  </>
                )
              }
            >
              <Form<IFieldName>
                id={editFormID}
                isNested
                submitButton={(_, isSubmitting) =>
                  cT((t) =>
                    isSubmitting
                      ? t.form["Applying changes..."]
                      : t.form["Confirm changes"],
                  )
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
                            {t((t) => t["Delete"])}
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
