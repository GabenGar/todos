import type { IMetaTag } from "#lib/seo";

export async function collectSEO() {
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

  return metaTags;
}
