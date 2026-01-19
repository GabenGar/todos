import { useEffect, useState } from "react";
import { InputSection, InputSectionText } from "@repo/ui/forms/sections";
import type { ILocalizationPage } from "#lib/localization";
import type { ITranslatableProps } from "#components/types";
import { Label } from "@repo/ui/forms";
import { InputTextArea } from "@repo/ui/forms/inputs";

interface IProps extends ITranslatableProps {
  t: ILocalizationPage["url-editor"];
  id: string;
  formID: string;
  name: string;
  label: string;
  defaultValue: string | undefined;
}

export function Hash({ formID, name, label, defaultValue }: IProps) {
  const [currentHash, changeCurrentHash] = useState(() => {
    return defaultValue;
  });

  useEffect(() => {
    changeCurrentHash(defaultValue);
  }, [defaultValue]);

  return (
    <InputSection>
      <Label htmlFor={`${formID}-${name}`}>{label}</Label>
      <InputTextArea
        id={`${formID}-${name}`}
        form={formID}
        name={name}
        rows={1}
        // using controllable input in there because it's the only way
        // to avoid synchronization bugs caused by `defaultValue`
        value={currentHash}
        onChange={(event) => {
          const nextHash = event.currentTarget.value;

          changeCurrentHash((oldHash) =>
            oldHash === nextHash ? oldHash : nextHash,
          );
        }}
      />
    </InputSection>
  );
}
