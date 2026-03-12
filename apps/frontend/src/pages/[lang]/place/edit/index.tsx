import type { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loading, Page } from "#components";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import { EditPlaceForm, editPlace, getPlace } from "#entities/place";
import { usePageTranslation, useTranslation } from "#hooks";
import { getSingleValueFromQuery } from "#lib/pages";
import { createPlacePageURL } from "#lib/urls";
import { createGetStaticProps, getStaticExportPaths } from "#server";

function PlaceEditPage({
  lang,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = usePageTranslation("page-place-edit");
  const { t: pT } = useTranslation("translation");
  const router = useRouter();
  const [currentPlace, changePlace] =
    useState<Awaited<ReturnType<typeof getPlace>>>();
  const { isReady, query } = router;
  const placeID = getSingleValueFromQuery(query, "place_id");
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);

  // biome-ignore lint/correctness/useExhaustiveDependencies: blah
  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!placeID) {
      router.replace("/404");
      return;
    }

    (async () => {
      const task = await getPlace(placeID);
      changePlace(task);
    })();
  }, [isReady, placeID]);

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <List>
                <ListItem>
                  {!currentPlace ? (
                    <Loading />
                  ) : (
                    <Link href={createPlacePageURL(lang, currentPlace.id)}>
                      {pT((t) => t.place["Place"])}
                    </Link>
                  )}
                </ListItem>
              </List>
            </OverviewHeader>

            <OverviewBody>
              {!currentPlace ? (
                <Loading />
              ) : (
                <EditPlaceForm
                  id={`edit-place-${currentPlace.id}`}
                  currentPlace={currentPlace}
                  onPlaceEdit={async (placeUpdate) => {
                    const editedTask = await editPlace(placeUpdate);

                    changePlace(editedTask);
                  }}
                />
              )}
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export const getStaticProps = createGetStaticProps("page-place-edit");

export const getStaticPaths = getStaticExportPaths;

export default PlaceEditPage;
