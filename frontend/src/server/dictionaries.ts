const dictionaries = {
  en: async () =>
    import("./dictionaries/en.json").then((module) => module.default),
};

export const getDictionary = async (locale: keyof typeof dictionaries) => {
  return await dictionaries[locale]();
};
