"use client";

import { useEffect, useState } from "react";
import { createPlacePageURL } from "#lib/urls";
import { IEntityItem } from "#lib/entities";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { createBlockComponent } from "#components/meta";
import { InputHidden } from "#components/form/input";
import {
  type IInputSectionProps,
  InputSection,
} from "#components/form/section";
import { Link } from "#components/link";
import { ListItem, ListLocal } from "#components/list";
import { Button, MenuButtons, MenuItem } from "#components/button";
import type { ITranslatableProps } from "#components/types";
import { Pre } from "#components/pre";
import { getPlaces } from "../lib/get";
import { type IPlace } from "../types";

import styles from "./place-section.module.scss";

interface IProps extends ITranslatableProps, IInputSectionProps {
  place?: IEntityItem;
  onPlaceChange?: (nextPlace: IEntityItem) => Promise<void>;
}

export const PlaceSection = createBlockComponent(styles, Component);

function Component({
  commonTranslation,
  id,
  form,
  name,
  place,
  required,
  children,
  onPlaceChange,
  ...props
}: IProps) {
  const [selectedPlace, changeSelectedPlace] = useState(place);

  return (
    <InputSection {...props}>
      <DescriptionList>
        <DescriptionSection
          className={styles.section}
          dKey={children}
          dValue={
            selectedPlace ? (
              <>
                <Link
                  href={createPlacePageURL(selectedPlace.id)}
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
              />
            )
          }
        />
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
  const [places, changePlaces] =
    useState<Awaited<ReturnType<typeof getPlaces>>>();

  useEffect(() => {
    (async () => {
      const newPlaces = await getPlaces();
      changePlaces(newPlaces);
    })();
  }, []);

  return (
    <div>
      {!places ? (
        <Loading />
      ) : places.pagination.totalCount === 0 ? (
        <p>{commonTranslation.list.no_items}</p>
      ) : (
        <ListLocal
          className={styles.list}
          commonTranslation={commonTranslation}
          pagination={places.pagination}
          onPageChange={async (page) => {
            const newPlaces = await getPlaces({ page });
            changePlaces(newPlaces);
          }}
        >
          {places.items.map((place) => (
            <ListItem key={place.id} className={styles.item}>
              <span className={styles.title}>{place.title}</span>
              <span className={styles.id}>
                (<Pre>{place.id}</Pre>)
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
          ))}
        </ListLocal>
      )}
    </div>
  );
}
