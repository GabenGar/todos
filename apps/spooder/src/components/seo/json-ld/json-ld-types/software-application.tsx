import { DescriptionSection } from "@repo/ui/description-list";
import { useTranslation } from "#hooks";
import type { ISoftwareApplicationJSONLD } from "#lib/seo/json-ld/types";

interface ISoftwareApplicationProps {
  jsonLD: ISoftwareApplicationJSONLD;
}

export function SoftwareApplicationJSONLD({
  jsonLD,
}: ISoftwareApplicationProps) {
  const { t } = useTranslation();
  const { description, applicationCategory, name, operatingSystem, url } =
    jsonLD;

  return (
    <>
      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["software-application"]
              .name,
        )}
        dValue={name}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["software-application"]
              .description,
        )}
        dValue={description}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["software-application"]
              .url,
        )}
        dValue={url}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["software-application"][
              "application-category"
            ],
        )}
        dValue={applicationCategory}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["software-application"][
              "operating-system"
            ],
        )}
        dValue={operatingSystem}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />
    </>
  );
}
