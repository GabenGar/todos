import { useRef, useState, useEffect } from "react";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { InputHidden } from "@repo/ui/forms/inputs";
import { InputSection } from "@repo/ui/forms/sections";
import type { ILocalizationPage } from "#lib/localization";
import type { ITranslatableProps } from "#components/types";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import { List, ListItem } from "@repo/ui/lists";
import { getPathnameSegments } from "@repo/ui/url";

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
  const [currentPathname, changeCurrentPathname] = useState(() =>
    getPathnameSegments(defaultValue),
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const isEmptyPath = !currentPathname || currentPathname.length === 0;

  useEffect(() => {
    changeCurrentPathname(getPathnameSegments(defaultValue));
  }, [defaultValue]);

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
                  <Preformatted>
                    {t["Segments"]}: {currentPathname.length}
                  </Preformatted>
                )
              }
            >
              {isEmptyPath ? undefined : (
                <List isOrdered>
                  {currentPathname.map((segment, index) => (
                    <ListItem key={index}>{segment}</ListItem>
                  ))}
                </List>
              )}
            </Details>
          }
        />
      </DescriptionList>
    </InputSection>
  );
}
