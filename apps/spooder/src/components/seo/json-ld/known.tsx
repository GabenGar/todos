import type { ReactNode } from "react";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import { useTranslation } from "#hooks";
import type { IJSONLD } from "#lib/seo/json-ld";
import { FAQPageJSONLD } from "./json-ld-types/faq-page";
import { OrganizationJSONLD } from "./json-ld-types/organization";
import { SoftwareApplicationJSONLD } from "./json-ld-types/software-application";
import { WebsiteJSONLD } from "./json-ld-types/website";

interface IProps {
  jsonLD: IJSONLD;
}

export function KnownJSONLDOverview({ jsonLD }: IProps) {
  const { t } = useTranslation();
  const { "@type": type, unknownKeys, "@context": context, "@id": id } = jsonLD;

  let title: string;
  let component: ReactNode;
  switch (type) {
    case "Organization": {
      title = t(
        (t) => t.seo["json-ld-overview"]["type-overview"].organization.type,
      );
      component = <OrganizationJSONLD jsonLD={jsonLD} />;
      break;
    }

    case "SoftwareApplication": {
      title = t(
        (t) =>
          t.seo["json-ld-overview"]["type-overview"]["software-application"]
            .type,
      );
      component = <SoftwareApplicationJSONLD jsonLD={jsonLD} />;
      break;
    }
    case "FAQPage": {
      title = t(
        (t) => t.seo["json-ld-overview"]["type-overview"]["faq-page"].type,
      );
      component = <FAQPageJSONLD jsonLD={jsonLD} />;
      break;
    }

    case "WebSite": {
      title = t(
        (t) => t.seo["json-ld-overview"]["type-overview"]["website"].type,
      );
      component = <WebsiteJSONLD jsonLD={jsonLD} />;
      break;
    }

    default: {
      throw new Error(`Unknown JSON-LD type "${type satisfies never}".`);
    }
  }

  return (
    <Details summary={<Preformatted>{title}</Preformatted>}>
      <DescriptionList>
        <DescriptionSection
          dKey={t((t) => t.seo["json-ld-overview"].context)}
          dValue={context}
          isKeyPreformatted
          isValuePreformatted
        />

        <DescriptionSection
          dKey={t((t) => t.seo["json-ld-overview"].id)}
          dValue={id}
          isOptional
          isKeyPreformatted
          isValuePreformatted
        />

        {component}

        {!unknownKeys ? undefined : (
          <DescriptionSection
            dKey={t((t) => t.seo["json-ld-overview"]["unknown-keys"])}
            dValue={
              <Details
                summary={<Preformatted>{unknownKeys.size}</Preformatted>}
              >
                <DescriptionList>
                  {Array.from(unknownKeys.entries()).map(([key, value]) => (
                    <DescriptionSection
                      key={key}
                      dKey={key}
                      dValue={String(value)}
                      isKeyPreformatted
                      isValuePreformatted
                    />
                  ))}
                </DescriptionList>
              </Details>
            }
            isOptional
            isKeyPreformatted
          />
        )}
      </DescriptionList>
    </Details>
  );
}
