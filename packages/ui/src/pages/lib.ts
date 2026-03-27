export function createMetaTitleFunction(siteName: string) {
  function createMetaTitle(title?: string) {
    if (!title) {
      return siteName;
    }

    return `${title} | ${siteName}`;
  }

  return createMetaTitle;
}
