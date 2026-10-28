import { parseString } from "@repo/ui/strings";
import type { IElementType } from "@repo/ui/types";
import { selectMetaElements } from "#lib/dom";
import type { IKnownMetaName, IMetaTag, ISEO, IUnknownMetaTag } from "#lib/seo";

interface IResult {
  seo: ISEO;
  errors?: Error[];
}

export async function collectSEO(): Promise<IResult> {
  const errors: Error[] = [];
  const title = collectTitle(errors);
  const { known, unknown } = selectMetaElements();
  const unknownMetaTags = collectUnknownMetaTags(unknown);
  const { description } = collectKnownMetaTags(known);

  const seo: ISEO = {
    title,
    unknownMetaTags,
  };

  if (description) {
    seo.description = description;
  }

  const result: IResult = {
    seo,
  };

  if (errors.length !== 0) {
    result.errors = errors;
  }

  return result;
}

function collectTitle(errors: Error[]): ISEO["title"] {
  // exclude <title> descendats of <svg> elements
  // since they have a different semantic meaning
  const elements = document.querySelectorAll("title:not(svg title)");
  const count = elements.length;

  if (count === 0) {
    errors.push(new Error("Failed to find a single <title> element."));

    return;
  } else if (count === 1) {
    const title = parseString(elements[0].textContent);

    return title;
  } else {
    const titles: string[] = [];

    for (const element of elements) {
      const title = parseString(element.textContent);

      if (title) {
        titles.push(title);
      }
    }

    return titles;
  }
}

function collectUnknownMetaTags(elements: HTMLMetaElement[]) {
  const unknownMetaTags = elements.map<IUnknownMetaTag>((element) => {
    const metaTag: IUnknownMetaTag = new Map();

    for (const attribute of element.attributes) {
      const name = attribute.name;
      const value = parseString(attribute.value);

      if (!value) {
        continue;
      }

      if (!metaTag.has(name)) {
        metaTag.set(name, value);
        continue;
      }

      // biome-ignore lint/style/noNonNullAssertion: it just works
      const currentValue = metaTag.get(name)!;

      if (Array.isArray(currentValue)) {
        currentValue.push(value);
      } else {
        metaTag.set(name, [currentValue, value]);
      }
    }

    return metaTag;
  });

  return unknownMetaTags;
}

const supportedNames = new Set([
  "description",
  "application-name",
] satisfies IKnownMetaName[]);

function isSupportedName(
  input: unknown,
): input is IElementType<typeof supportedNames> {
  return supportedNames.has(input as IElementType<typeof supportedNames>);
}

function collectKnownMetaTags(
  elements: HTMLMetaElement[],
): Pick<ISEO, "description" | "applicationName"> {
  const result: ReturnType<typeof collectKnownMetaTags> = {};

  for (const element of elements) {
    const name = element.name as IKnownMetaName;

    if (!isSupportedName(name)) {
      continue;
    }

    const content = parseString(element.content);

    const metaTag: IMetaTag = {
      name,
      content,
    };
    const unkownAttributes: Required<IMetaTag>["unknownAttributes"] = new Map();

    for (const attribute of element.attributes) {
      const attrName = attribute.name;

      if (attrName === "name" || attrName === "content") {
        continue;
      }

      const attrValue = parseString(attribute.value);

      if (!unkownAttributes.has(attrName)) {
        unkownAttributes.set(attrName, attrValue);
        continue;
      }

      // biome-ignore lint/style/noNonNullAssertion: it just works
      const oldValue = unkownAttributes.get(attrName)!;

      if (Array.isArray(oldValue)) {
        oldValue.push(attrValue);
        continue;
      }

      unkownAttributes.set(attrName, [oldValue, attrValue]);
    }

    if (unkownAttributes.size !== 0) {
      metaTag.unknownAttributes = unkownAttributes;
    }

    const lookupKey = name === "application-name" ? "applicationName" : name;
    const oldMeta = result[lookupKey];

    if (!oldMeta) {
      result[lookupKey] = metaTag;
      continue;
    }

    if (Array.isArray(oldMeta)) {
      oldMeta.push(metaTag);
      continue;
    }

    result[lookupKey] = [oldMeta, metaTag];
  }

  return result;
}
