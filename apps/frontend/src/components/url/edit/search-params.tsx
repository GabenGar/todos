import { InputSection } from "@repo/ui/forms/sections";
import type { ILocalizationPage } from "#lib/localization";
import type { ITranslatableProps } from "#components/types";

interface IProps extends ITranslatableProps {
  t: ILocalizationPage["url-editor"];
  id: string;
  formID: string;
  name: string;
  defaultValue: string | undefined;
}

export function SearchParams({}: IProps) {
  return <InputSection></InputSection>
}
