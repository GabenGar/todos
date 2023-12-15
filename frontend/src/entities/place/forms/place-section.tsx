"use client";

import { useEffect, useState } from "react";
import { createPlacePageURL } from "#lib/urls";
import type { ILocalization } from "#lib/localization";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { createBlockComponent } from "#components/meta";
import { InputHidden } from "#components/form/input";
import { IInputSectionProps, InputSection } from "#components/form/section";
import { Link } from "#components/link";
import { List } from "#components/list";
import { Button } from "#components/button";
import { getPlace, getPlaces } from "../lib/get";
import { type IPlace } from "../types";
import { ITranslatableProps } from "#components/types";

interface IProps extends ITranslatableProps, IInputSectionProps {
  place?: IPlace;
}

export const PlaceSection = createBlockComponent(undefined, Component);

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
  const [currentPlace, changeCurrentPlace] =
    useState<Awaited<ReturnType<typeof getPlace>>>();

  return (
    <InputSection {...props}>
      {place ? (
        <DescriptionList>
          <DescriptionSection
            dKey={children}
            dValue={
              <Link href={createPlacePageURL(place.id)} target="_blank">
                {place.title} ({place.id})
              </Link>
            }
          />
        </DescriptionList>
      ) : (
        <PlaceSelector
          translation={translation}
          onSelect={async (newPlace) => {
            changeCurrentPlace(newPlace);
          }}
        />
      )}

      <InputHidden
        id={id}
        form={form}
        name={name}
        required={required}
        defaultValue={place?.id ?? currentPlace?.id}
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
        <List
          items={places.items.map((place) => (
            <>
              <span>
                {place.title} ({place.id})
              </span>
              <Button
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
            </>
          ))}
        />
      )}
    </div>
  );
}
