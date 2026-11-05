import { DescriptionSection } from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import { OneOrManyItems } from "@repo/ui/lists";
import { useTranslation } from "#hooks";
import type { IOrganizationJSONLD } from "#lib/seo/json-ld";

interface IOrganizationProps {
  jsonLD: IOrganizationJSONLD;
}

export function OrganizationJSONLD({ jsonLD }: IOrganizationProps) {
  const { t } = useTranslation();
  const { name, alternateName, url, logo, description, sameAs } = jsonLD;

  return (
    <>
      <DescriptionSection
        dKey={t(
          (t) => t.seo["json-ld-overview"]["type-overview"].organization.name,
        )}
        dValue={name}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"].organization[
              "alternate-name"
            ],
        )}
        dValue={alternateName}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) => t.seo["json-ld-overview"]["type-overview"].organization.url,
        )}
        dValue={url}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) => t.seo["json-ld-overview"]["type-overview"].organization.logo,
        )}
        dValue={logo}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"].organization.description,
        )}
        dValue={description}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"].organization["same-as"],
        )}
        dValue={
          <Details summary={sameAs?.length}>
            <OneOrManyItems
              item={sameAs}
              itemElement={(url) => <Preformatted>{url}</Preformatted>}
            />
          </Details>
        }
        isOptional
        isKeyPreformatted
      />
    </>
  );
}
