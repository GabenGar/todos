import { DescriptionList, DescriptionSection } from "#description-list";
import { Details } from "#details";
import { Preformatted } from "#formatting";
import { useTranslation } from "#hooks";
import { List, ListItem } from "#lists";

interface IProps {
  pathname: string;
}
export function Pathname({ pathname }: IProps) {
  const { t } = useTranslation();
  const segments = pathname.split("/").slice(1);
  const totalSegments = segments.length;

  return (
    <DescriptionList>
      <DescriptionSection
        dKey={t((t) => t.url["Pathname"])}
        dValue={<Preformatted>{pathname}</Preformatted>}
      />

      {totalSegments === 0 ? (
        <DescriptionSection
          dKey={t((t) => t.url["Segments"])}
          dValue={<Preformatted>{totalSegments}</Preformatted>}
          isHorizontal
        />
      ) : (
        <DescriptionSection
          dKey={t((t) => t.url["Segments"])}
          dValue={
            <Details summary={<Preformatted>{totalSegments}</Preformatted>}>
              <List isOrdered>
                {segments.map((segment, index) => (
                  <ListItem key={`${segment}${index}`}>
                    <Preformatted>/{segment}</Preformatted>
                  </ListItem>
                ))}
              </List>
            </Details>
          }
        />
      )}
    </DescriptionList>
  );
}
