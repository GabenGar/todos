"use client";

import { useState } from "react";
import { createPlacePageURL } from "#lib/urls";
import { DescriptionList, DescriptionSection } from "#components";
import { createBlockComponent } from "#components/meta";
import { InputHidden } from "#components/form/input";
import { IInputSectionProps, InputSection } from "#components/form/section";
import { Link } from "#components/link";
import { getPlace } from "../lib/get";
import { IPlace } from "../types";

interface IProps extends IInputSectionProps {
  place?: IPlace;
}

export const PlaceSection = createBlockComponent(undefined, Component);

function Component({
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
      ) : undefined}

      <InputHidden
        id={id}
        form={form}
        name={name}
        required={required}
        defaultValue={place?.id}
      />
    </InputSection>
  );
}
