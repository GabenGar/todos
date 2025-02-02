import { DescriptionList, DescriptionSection } from "#description-list";
import { Details } from "#details";
import { Preformatted } from "#formatting";
import type { IURLViewerProps } from "./viewer";

interface IProps extends Pick<IURLViewerProps, "t"> {
  pathname: string;
}
export function Pathname({ t, pathname }: IProps) {
  const segments = pathname.split("/").slice(1);
  const totalSegments = segments.length;

  return (
    <DescriptionList>
      <DescriptionSection
        dKey={t("Pathname")}
        dValue={<Preformatted>{pathname}</Preformatted>}
      />

      {totalSegments === 0 ? (
        <DescriptionSection
          dKey={t("Segments")}
          dValue={<Preformatted>{totalSegments}</Preformatted>}
          isHorizontal
        />
      ) : (
        <DescriptionSection
          dKey={t("Segments")}
          dValue={
            <Details
              summary={<Preformatted>{totalSegments}</Preformatted>}
            ><></></Details>
          }
        />
      )}
    </DescriptionList>
  );
}
