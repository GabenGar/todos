import type { ReactNode } from "react";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import { useTranslation } from "#hooks";
import type { IJSONLD } from "#lib/seo/json-ld";
import { ArticleJSONLD } from "./json-ld-types/article";
import { FAQPageJSONLD } from "./json-ld-types/faq-page";
import { OrganizationJSONLD } from "./json-ld-types/organization";
import { ProfilePageJSONLD } from "./json-ld-types/profile-page";
import { SoftwareApplicationJSONLD } from "./json-ld-types/software-application";
import { VideoObjectJSONLD } from "./json-ld-types/video-object";
import { WebPageJSONLD } from "./json-ld-types/web-page";
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

    case "ProfilePage": {
      title = t(
        (t) => t.seo["json-ld-overview"]["type-overview"]["profile-page"].type,
      );
      component = <ProfilePageJSONLD jsonLD={jsonLD} />;
      break;
    }

    case "Article": {
      title = t(
        (t) =>
          t.seo["json-ld-overview"]["type-overview"]["article"]["type-name"],
      );
      component = <ArticleJSONLD jsonLD={jsonLD} />;
      break;
    }

    case "WebPage": {
      title = t(
        (t) =>
          t.seo["json-ld-overview"]["type-overview"]["web-page"]["type-name"],
      );
      component = <WebPageJSONLD jsonLD={jsonLD} />;
      break;
    }

    case "VideoObject": {
      title = t(
        (t) =>
          t.seo["json-ld-overview"]["type-overview"]["video-object"][
            "type-name"
          ],
      );
      component = <VideoObjectJSONLD jsonLD={jsonLD} />;
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
