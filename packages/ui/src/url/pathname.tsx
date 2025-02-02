import { DescriptionList, DescriptionSection } from "#description-list";
import { Preformatted } from "#formatting";
import type { IURLViewerProps } from "./viewer";

interface IProps extends Pick<IURLViewerProps, "t"> {
  pathname: string;
}
export function Pathname({ t, pathname }: IProps) {
  const segments = pathname.split("/")

  return (
    <DescriptionList>
      <DescriptionSection
        dKey={<>{t("Pathname")} ({segments.length} segments)</>}
        dValue={<Preformatted>{pathname}</Preformatted>}
      />
    </DescriptionList>
  );
}
