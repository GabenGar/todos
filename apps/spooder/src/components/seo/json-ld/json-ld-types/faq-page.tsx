import { Details } from "@repo/ui/details";
import { OneOrManyItems } from "@repo/ui/lists";
// import { useTranslation } from "#hooks";
import type { IFAQPageJSONLD } from "#lib/seo/json-ld";

interface IFAQPageProps {
  jsonLD: IFAQPageJSONLD;
}

export function FAQPageJSONLD({ jsonLD }: IFAQPageProps) {
  // const { t } = useTranslation();
  const { mainEntity } = jsonLD;

  return (
    <OneOrManyItems
      item={mainEntity}
      itemElement={(entity) => {
        if (!entity) {
          return undefined;
        }

        const { name, acceptedAnswer } = entity;

        return (
          <Details summary={name}>
            {acceptedAnswer?.text}
          </Details>
        );
      }}
    />
  );
}
