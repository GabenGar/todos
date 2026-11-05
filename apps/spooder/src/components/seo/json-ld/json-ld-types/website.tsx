import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { useTranslation } from "#hooks";
import type { IWebSiteJSONLD } from "#lib/seo/json-ld";

interface IWebsiteProps {
  jsonLD: IWebSiteJSONLD;
}

export function WebsiteJSONLD({ jsonLD }: IWebsiteProps) {
  const { t } = useTranslation();
  const { potentialAction, name, publisher, url } = jsonLD;

  return (
    <>
      <DescriptionSection
        dKey={t((t) => t.seo["json-ld-overview"]["type-overview"].website.url)}
        dValue={url}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t((t) => t.seo["json-ld-overview"]["type-overview"].website.name)}
        dValue={name}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      {!publisher ? undefined : (
        <DescriptionSection
          dKey={t(
            (t) => t.seo["json-ld-overview"]["type-overview"].website.publisher,
          )}
          dValue={
            <DescriptionList isNested>
              <DescriptionSection
                dKey={t(
                  (t) =>
                    t.seo["json-ld-overview"]["type-overview"].website[
                      "publisher-overview"
                    ].id,
                )}
                dValue={publisher["@id"]}
                isOptional
                isKeyPreformatted
                isValuePreformatted
              />
            </DescriptionList>
          }
          isKeyPreformatted
        />
      )}

      {!potentialAction ? undefined : (
        <DescriptionSection
          dKey={t(
            (t) =>
              t.seo["json-ld-overview"]["type-overview"].website[
                "potential-action"
              ],
          )}
          dValue={
            <DescriptionList isNested>
              <DescriptionSection
                dKey={t(
                  (t) =>
                    t.seo["json-ld-overview"]["type-overview"].website[
                      "potential-action-overview"
                    ].type,
                )}
                dValue={potentialAction["@type"]}
                isKeyPreformatted
                isValuePreformatted
              />

              <DescriptionSection
                dKey={t(
                  (t) =>
                    t.seo["json-ld-overview"]["type-overview"].website[
                      "potential-action-overview"
                    ]["query-input"],
                )}
                dValue={potentialAction["query-input"]}
                isOptional
                isKeyPreformatted
                isValuePreformatted
              />

              {!potentialAction.target ? undefined : (
                <DescriptionSection
                  dKey={t(
                    (t) =>
                      t.seo["json-ld-overview"]["type-overview"].website[
                        "potential-action-overview"
                      ].target,
                  )}
                  dValue={
                    <DescriptionList isNested>
                      <DescriptionSection
                        dKey={t(
                          (t) =>
                            t.seo["json-ld-overview"]["type-overview"].website[
                              "potential-action-overview"
                            ]["target-overview"].type,
                        )}
                        dValue={potentialAction.target["@type"]}
                        isOptional
                        isKeyPreformatted
                        isValuePreformatted
                      />

                      <DescriptionSection
                        dKey={t(
                          (t) =>
                            t.seo["json-ld-overview"]["type-overview"].website[
                              "potential-action-overview"
                            ]["target-overview"]["url-template"],
                        )}
                        dValue={potentialAction.target.urlTemplate}
                        isOptional
                        isKeyPreformatted
                        isValuePreformatted
                      />
                    </DescriptionList>
                  }
                  isKeyPreformatted
                  isValuePreformatted
                />
              )}
            </DescriptionList>
          }
          isKeyPreformatted
          isValuePreformatted
        />
      )}
    </>
  );
}
