import { DateTimeView, toISODateTime } from "#dates";
import { DescriptionList, DescriptionSection } from "#description-list";
import { Details } from "#details";
import { Preformatted } from "#formatting";
import { useClient, useTranslation } from "#hooks";
import { ListItem } from "#lists";
import { Loading } from "#loading";
//

import styles from "./item.module.scss";

interface IProps {
  file: File;
}

export function FileItem({ file }: IProps) {
  const { t } = useTranslation();
  const client = useClient();
  const { type, name, size, lastModified } = file;
  const lastModifiedDateTime = toISODateTime(new Date(lastModified));

  return (
    <ListItem className={styles.file}>
      <Details summary={<Preformatted>{name}</Preformatted>}>
        <DescriptionList>
          <DescriptionSection
            dKey={t((t) => t.file.type)}
            dValue={type}
            isKeyPreformatted
            isValuePreformatted
            isHorizontal
          />

          <DescriptionSection
            dKey={t((t) => t.file.size)}
            dValue={size}
            isKeyPreformatted
            isValuePreformatted
            isHorizontal
          />

          <DescriptionSection
            dKey={t((t) => t.file["last-modified"])}
            dValue={
              !client ? (
                <Loading />
              ) : (
                <DateTimeView dateTime={lastModifiedDateTime} />
              )
            }
            isKeyPreformatted
            isValuePreformatted
          />
        </DescriptionList>
      </Details>
    </ListItem>
  );
}
