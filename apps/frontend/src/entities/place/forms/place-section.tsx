import { useState } from "react";
import { createBlockComponent } from "@repo/ui/meta";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionSection,
  DescriptionTerm,
} from "#components";
import { Button, MenuButtons, MenuItem } from "#components/button";
import { EntityList } from "#components/entities";
import { InputHidden } from "#components/form/input";
import {
  type IInputSectionProps,
  InputSection,
} from "#components/form/section";
import { Link } from "#components/link";
import { ListItem } from "#components/list";
import { Pre } from "#components/pre";
import type { ILocalizableProps } from "#components/types";
import { useTranslation } from "#hooks";
import type { IEntityItem } from "#lib/entities";
import { createPlacePageURL } from "#lib/urls";
import { getPlaces } from "../lib/get";
import type { IPlace } from "../types";
//

import styles from "./place-section.module.scss";

interface IProps extends ILocalizableProps, IInputSectionProps {
  place?: IEntityItem;
}

export const PlaceSection = createBlockComponent(styles, Component);

function Component({
  language,
  id,
  form,
  name,
  place,
  required,
  children,
  ...props
}: IProps) {
  const { t } = useTranslation("common");
  const [selectedPlace, changeSelectedPlace] = useState(place);

  return (
    <InputSection {...props}>
      <DescriptionList>
        <DescriptionSection className={styles.section}>
          <DescriptionTerm>{children}</DescriptionTerm>
          <DescriptionDetails className={styles.details}>
            {selectedPlace ? (
              <>
                <Link
                  href={createPlacePageURL(language, selectedPlace.id)}
                  target="_blank"
                >
                  {selectedPlace.title} ({selectedPlace.id})
                </Link>
                <MenuButtons>
                  <MenuItem onClick={() => changeSelectedPlace(undefined)}>
                    {t((t) => t.list["Select"])}
                  </MenuItem>
                  <MenuItem
                    disabled={selectedPlace.id === place?.id}
                    onClick={() => changeSelectedPlace(place)}
                  >
                    {t((t) => t.list["Reset"])}
                  </MenuItem>
                </MenuButtons>
              </>
            ) : (
              <PlaceSelector
                onSelect={async (newPlace) => {
                  changeSelectedPlace(newPlace);
                }}
                selectedPlace={selectedPlace}
              />
            )}
          </DescriptionDetails>
        </DescriptionSection>
      </DescriptionList>

      <InputHidden
        id={id}
        form={form}
        name={name}
        required={required}
        defaultValue={selectedPlace?.id}
      />
    </InputSection>
  );
}

interface IPlaceSelectorProps {
  selectedPlace?: IPlace;
  onSelect: (place: IPlace) => Promise<void>;
}

function PlaceSelector({ selectedPlace, onSelect }: IPlaceSelectorProps) {
  const { t } = useTranslation("common");

  return (
    <EntityList<IPlace>
      className={styles.list}
      fetchEntities={async (page) => await getPlaces({ page })}
      mapEntity={(place) => (
        <ListItem key={place.id} className={styles.item}>
          <span className={styles.title}>{place.title}</span>
          <span className={styles.id}>
            <Pre>({place.id})</Pre>
          </span>
          <Button
            className={styles.select}
            disabled={selectedPlace?.id === place.id}
            onClick={async () => {
              if (selectedPlace?.id === place.id) {
                return;
              }

              await onSelect(place);
            }}
          >
            {t((t) => t.list["Select"])}
          </Button>
        </ListItem>
      )}
    />
  );
}
