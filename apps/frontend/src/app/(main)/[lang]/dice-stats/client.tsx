"use client";

import { useSearchParams } from "next/navigation";
import type { ILocalizationPage } from "#lib/localization";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import type { ITranslatableProps } from "#components/types";
import { DiceStatsForm } from "./form";

interface IProps extends ITranslatableProps {
  translation: ILocalizationPage["dice-stats"];
}

export function Client({ commonTranslation, translation }: IProps) {
  const searchParams = useSearchParams();
  const inputFaces = searchParams.get("faces")?.trim();
  const faces = !inputFaces ? undefined : Number(inputFaces);
  const inputCount = searchParams.get("count")?.trim();
  const count = !inputCount ? undefined : Number(inputCount);
  const inputIsReroll = searchParams.get("reroll_duplicates")?.trim();
  const isReroll = !inputIsReroll ? undefined : inputIsReroll === "true";

  return (
    <Overview headingLevel={2}>
      {() => (
        <>
          <OverviewHeader>
            <DiceStatsForm
              commonTranslation={commonTranslation}
              translation={translation}
              id="dice-stats"
              faces={faces}
              count={count}
              isRerolledOnDuplicates={isReroll}
              onDiceStats={async (stats) => {
                console.log(Object.fromEntries(stats.states));
              }}
            />
          </OverviewHeader>

          <OverviewBody></OverviewBody>
        </>
      )}
    </Overview>
  );
}
