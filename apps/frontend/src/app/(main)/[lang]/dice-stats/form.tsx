import type { ILocalizationPage } from "#lib/localization";
import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import type { ITranslatableProps } from "#components/types";
import {
  InputSectionCheckbox,
  InputSectionInteger,
} from "#components/form/section";

interface IProps extends ITranslatableProps, IFormComponentProps {
  translation: ILocalizationPage["dice-stats"];
  faces?: number;
  count?: number;
  isRerolledOnDuplicates?: boolean;
  onDiceStats: (stats: IDiceStats) => Promise<void>;
}

interface IDiceStats {
  minValue: number;
  maxValue: number;
  states: DiceStates;
}

/**
 * A mapping of values and their counts.
 */
interface DiceStates extends Map<number, number> {}

export function DiceStatsForm({
  commonTranslation,
  translation,
  id,
  faces,
  count,
  isRerolledOnDuplicates,
  onDiceStats,
}: IProps) {
  const FIELD = {
    FACES: { name: "faces", label: translation["Faces"] },
    COUNT: { name: "count", label: translation["Count"] },
    REROLL_DUPLICATES: {
      name: "reroll_duplicates",
      label: translation["Reroll on duplicates"],
    },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const elements = event.currentTarget.elements;
    const faces = Number(elements.faces.value.trim());
    const count = Number(elements.count.value.trim());
    const isRerolled = elements.reroll_duplicates.checked;

    const stats = calculateStats(faces, count, isRerolled);

    await onDiceStats(stats);
  }

  return (
    <Form<IFieldName>
      commonTranslation={commonTranslation}
      id={id}
      submitButton={(formID, isSubmitting) =>
        !isSubmitting
          ? translation["Calculate stats"]
          : translation["Calculating stats..."]
      }
      onSubmit={handleSubmit}
    >
      {(formID) => (
        <>
          <InputSectionInteger
            id={`${formID}-${FIELD.FACES.name}`}
            form={formID}
            name={FIELD.FACES.name}
            min={1}
            defaultValue={faces ?? 6}
            required
          >
            {FIELD.FACES.label}
          </InputSectionInteger>

          <InputSectionInteger
            id={`${formID}-${FIELD.COUNT.name}`}
            form={formID}
            name={FIELD.COUNT.name}
            min={1}
            defaultValue={count ?? 2}
            required
          >
            {FIELD.COUNT.label}
          </InputSectionInteger>

          <InputSectionCheckbox
            id={`${formID}-${FIELD.REROLL_DUPLICATES.name}`}
            form={formID}
            name={FIELD.REROLL_DUPLICATES.name}
            defaultValue="true"
            defaultChecked={isRerolledOnDuplicates ?? false}
          >
            {FIELD.REROLL_DUPLICATES.label}
          </InputSectionCheckbox>
        </>
      )}
    </Form>
  );
}

function calculateStats(
  faces: number,
  count: number,
  isRerolledOnDuplicates?: boolean,
): IDiceStats {
  const minValue = count;
  const maxValue = faces * count;
  const states: DiceStates = new Map();

  for (let step = minValue; step < maxValue + 1; step = step + 1) {
    states.set(step, 0);
  }

  return {
    minValue,
    maxValue,
    states,
  };
}

function calculateOccurencesForValue(value: number, minValue: number, maxValue: number) {}
