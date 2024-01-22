"use client";

import { useEffect, useState } from "react";
import { createPlacePageURL } from "#lib/urls";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { createBlockComponent } from "#components/meta";
import { InputHidden } from "#components/form/input";
import {
  type IInputSectionProps,
  InputSection,
} from "#components/form/section";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import { Button } from "#components/button";
import type { ITranslatableProps } from "#components/types";
import { Pre } from "#components/pre";
import { getPlace, getPlaces } from "../lib/get";
import { type IPlace } from "../types";

import styles from "./place-section.module.scss";

interface IProps extends ITranslatableProps, IInputSectionProps {
  place?: IPlace;
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
  ...props
}: IProps) {
  const [currentPlace, changeCurrentPlace] = useState<
    Awaited<ReturnType<typeof getPlace>> | undefined
  >(place);

  return (
    <InputSection {...props}>
      {
        <DescriptionList>
          <DescriptionSection
            dKey={children}
            dValue={
              currentPlace ? (
                <Link
                  href={createPlacePageURL(currentPlace.id)}
                  target="_blank"
                >
                  {currentPlace.title} ({currentPlace.id})
                </Link>
              ) : (
                <PlaceSelector
                  commonTranslation={commonTranslation}
                  onSelect={async (newPlace) => {
                    changeCurrentPlace(newPlace);
                  }}
                />
              )
            }
          />
        </DescriptionList>
      }

      <InputHidden
        id={id}
        form={form}
        name={name}
        required={required}
        defaultValue={currentPlace?.id}
      />
    </InputSection>
  );
}

interface IPlaceSelectorProps extends Pick<IProps, "commonTranslation"> {
  selectedPlace?: IPlace;
  onSelect: (place: IPlace) => Promise<void>;
}

/**
 * @TODO paginated list
 */
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
        <List className={styles.list}>
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
                Select
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}
