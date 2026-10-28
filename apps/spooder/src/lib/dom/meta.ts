import { isKnownMetaName } from "#lib/seo";

interface IResult {
  known: HTMLMetaElement[];
  unknown: HTMLMetaElement[];
}

export function selectMetaElements(): IResult {
  const metaElements = document.querySelectorAll("meta");
  const known: HTMLMetaElement[] = [];
  const unknown: HTMLMetaElement[] = [];

  for (const element of metaElements) {
    const name = element.getAttribute("name");

    if (name === null || !isKnownMetaName(name)) {
      unknown.push(element);
      continue;
    }

    known.push(element);
  }

  const result: IResult = {
    known,
    unknown,
  };

  return result;
}
