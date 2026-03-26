import { DescriptionList, DescriptionSection } from "#description-list";
import { useTranslation } from "#hooks";

interface IProps {
  hash: string;
}

/**
 * @TODO per-type rundown
 */
export function Hash({ hash }: IProps) {
  const { t } = useTranslation();
  const hashType = guessHashType(hash);

  return (
    <DescriptionList>
      <DescriptionSection
        dKey={t((t) => t.url.hash.type)}
        dValue={t((t) => t.url.hash[hashType])}
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t((t) => t.url.hash.value)}
        dValue={hash}
        isKeyPreformatted
        isValuePreformatted
      />
    </DescriptionList>
  );
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment
 */
type IHashType =
  | "fragment"
  | "temporal-dimension-media-fragment"
  | "spatial-dimension-media-fragment"
  | "text-fragment";

function guessHashType(value: string): IHashType {
  // get rid of "#"
  const normalizedValue = value.slice(1);

  if (normalizedValue.startsWith("t=")) {
    return "temporal-dimension-media-fragment";
  }

  if (normalizedValue.startsWith("xywh=")) {
    return "spatial-dimension-media-fragment";
  }

  if (normalizedValue.startsWith(":~:text=")) {
    return "text-fragment";
  }

  return "fragment";
}
