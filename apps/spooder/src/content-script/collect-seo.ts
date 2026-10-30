import { parseString } from "@repo/ui/strings";
import type { IElementType, IMaybe, IOneOrMany } from "@repo/ui/types";
import { selectMetaElements } from "#lib/dom";
import type { IKnownMetaName, IMetaTag, ISEO, IUnknownMetaTag } from "#lib/seo";

interface IResult {
  seo: ISEO;
  errors?: Error[];
}

export async function collectSEO(): Promise<IResult> {
  const errors: Error[] = [];
  const title = collectTitle(errors);
  const { known, unknown, invalid } = selectMetaElements();
  const charSet = collectCharset(unknown)
  const unknownMetaTags = collectUnknownMetaTags(unknown);
  const invalidMetaTags = collectInvalidMetaTags(invalid);
  const {
    description,
    applicationName,
    author,
    colorScheme,
    creator,
    generator,
    googlebot,
    keywords,
    publisher,
    referrer,
    responsiveEmbeddedSizing,
    robots,
    textScale,
    themeColor,
    viewport,
  } = collectKnownMetaTags(known);

  const seo: ISEO = {
    charSet,
    title,
    unknownMetaTags,
    invalidMetaTags,
  };

  if (description) {
    seo.description = description;
  }

  if (applicationName) {
    seo.applicationName = applicationName;
  }

  if (author) {
    seo.author = author;
  }

  if (colorScheme) {
    seo.colorScheme = colorScheme;
  }

  if (creator) {
    seo.creator = creator;
  }

  if (generator) {
    seo.generator = generator;
  }

  if (googlebot) {
    seo.googlebot = googlebot;
  }

  if (keywords) {
    seo.keywords = keywords;
  }

  if (publisher) {
    seo.publisher = publisher;
  }

  if (referrer) {
    seo.referrer = referrer;
  }

  if (responsiveEmbeddedSizing) {
    seo.responsiveEmbeddedSizing = responsiveEmbeddedSizing;
  }

  if (robots) {
    seo.robots = robots;
  }

  if (textScale) {
    seo.textScale = textScale;
  }

  if (themeColor) {
    seo.themeColor = themeColor;
  }

  if (viewport) {
    seo.viewport = viewport;
  }

  const result: IResult = {
    seo,
  };

  if (errors.length !== 0) {
    result.errors = errors;
  }

  return result;
}

function collectCharset(
  elements: HTMLMetaElement[],
): IMaybe<IOneOrMany<string>> {
  let result: IMaybe<IOneOrMany<string>> = undefined;

  for (const element of elements) {
    if (!element.hasAttribute("charset")) {
      continue;
    }

    // biome-ignore lint/style/noNonNullAssertion: blah
    const charSet = element.getAttribute("charset")!

    if (!result) {
      result = charSet
      continue
    }

    if (Array.isArray(result)) {
      result.push(charSet)
      continue
    }

    result = [result, charSet]
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

function collectInvalidMetaTags(elements: HTMLMetaElement[]) {
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
  "author",
  "color-scheme",
  "generator",
  "keywords",
  "referrer",
  "theme-color",
  "responsive-embedded-sizing",
  "text-scale",
  "viewport",
  "creator",
  "publisher",
  "googlebot",
  "robots",
] satisfies IKnownMetaName[]);

type ISupportedName = IElementType<typeof supportedNames>;

type ISEOMeta = Omit<
  ISEO,
  "charSet" | "title" | "unknownMetaTags" | "invalidMetaTags"
>;

type ISEOKey = keyof ISEOMeta;

function isSupportedName(input: unknown): input is ISupportedName {
  return supportedNames.has(input as ISupportedName);
}

function collectKnownMetaTags(elements: HTMLMetaElement[]): ISEOMeta {
  const result: ReturnType<typeof collectKnownMetaTags> = {};

  for (const element of elements) {
    const isCharset = element.hasAttribute("charset");

    if (isCharset) {
      // charsets are already collected
      continue;
    }

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

    const lookupKey = normalizeLookupKey(name);
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

function normalizeLookupKey(name: ISupportedName): ISEOKey {
  switch (name) {
    case "application-name": {
      return "applicationName";
    }
    case "color-scheme": {
      return "colorScheme";
    }

    case "theme-color": {
      return "themeColor";
    }

    case "responsive-embedded-sizing": {
      return "responsiveEmbeddedSizing";
    }

    case "text-scale": {
      return "textScale";
    }

    default: {
      return name;
    }
  }
}
