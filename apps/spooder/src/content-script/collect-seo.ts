import type { IMetaTag, ISEO } from "#lib/seo";

interface IResult {
  seo: ISEO;
  errors?: Error[];
}

export async function collectSEO(): Promise<IResult> {
  const errors: Error[] = [];
  const title = collectTitle(errors);
  const metaElements = document.querySelectorAll("meta");
  const metaTags: IMetaTag[] = [];

  for (const element of metaElements) {
    const metaTag: IMetaTag = new Map();

    for (const attribute of element.attributes) {
      const key = attribute.name;
      const value = attribute.value;

      if (!metaTag.has(key)) {
        metaTag.set(key, value);
      } else {
        // biome-ignore lint/style/noNonNullAssertion: it's there
        const oldValue = metaTag.get(key)!;

        if (Array.isArray(oldValue)) {
          oldValue.push(value);
        } else {
          metaTag.set(key, [oldValue, value]);
        }
      }
    }

    metaTags.push(metaTag);
  }

  const seo: ISEO = {
    title,
    metaTags,
  };

  const result: IResult = {
    seo,
  };

  if (errors.length !== 0) {
    result.errors = errors;
  }

  return result;
}

function collectTitle(errors: Error[]): ISEO["title"] {
  const elements = document.querySelectorAll("title");
  const count = elements.length;

  if (count === 0) {
    errors.push(new Error("Failed to find a single <title> element."));

    return;
  } else if (count === 1) {
    const textContent = elements[0].textContent.trim();
    const title = textContent.length === 0 ? undefined : textContent;

    return title;
  } else {
    const titles: string[] = [];

    for (const element of elements) {
      const textContent = element.textContent.trim();
      const title = textContent.length === 0 ? undefined : textContent;

      if (title) {
        titles.push(title);
      }
    }

    return titles;
  }
}
