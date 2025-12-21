import { useState } from "react";
import { createPlacePageURL } from "#lib/urls";
import { IEntityItem } from "#lib/entities";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionSection,
  DescriptionTerm,
} from "#components";
import { createBlockComponent } from "@repo/ui/meta";
import { InputHidden } from "#components/form/input";
import {
  type IInputSectionProps,
  InputSection,
} from "#components/form/section";
import { Link } from "#components/link";
import { ListItem } from "#components/list";
import { Button, MenuButtons, MenuItem } from "#components/button";
import type { ILocalizableProps, ITranslatableProps } from "#components/types";
import { Pre } from "#components/pre";
import { EntityList } from "#components/entities";
import { getPlaces } from "../lib/get";
import { type IPlace } from "../types";

import styles from "./place-section.module.scss";

interface IProps
  extends ILocalizableProps,
    ITranslatableProps,
    IInputSectionProps {
  place?: IEntityItem;
}

export const PlaceSection = createBlockComponent(styles, Component);

function Component({
  language,
  commonTranslation,
  id,
  form,
  name,
  place,
  required,
  children,
  ...props
}: IProps) {
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
                    {commonTranslation.list["Select"]}
                  </MenuItem>
                  <MenuItem
                    disabled={selectedPlace.id === place?.id}
                    onClick={() => changeSelectedPlace(place)}
                  >
                    {commonTranslation.list["Reset"]}
                  </MenuItem>
                </MenuButtons>
              </>
            ) : (
              <PlaceSelector
                commonTranslation={commonTranslation}
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

interface IPlaceSelectorProps extends Pick<IProps, "commonTranslation"> {
  selectedPlace?: IPlace;
  onSelect: (place: IPlace) => Promise<void>;
}

function PlaceSelector({
  commonTranslation,
  selectedPlace,
  onSelect,
}: IPlaceSelectorProps) {
  return (
    <EntityList<IPlace>
      className={styles.list}
      commonTranslation={commonTranslation}
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
            {commonTranslation.list["Select"]}
          </Button>
        </ListItem>
      )}
    />
  );
}
