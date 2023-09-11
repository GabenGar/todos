const dictionaries = {
  en: async () => {
    const dictModule = await import("./dictionaries/en.json");
    return dictModule.default;
  },
  ru: async () => {
    const dictModule = await import("./dictionaries/ru.json");
    return dictModule.default;
  }
};

export const getDictionary = async (locale: keyof typeof dictionaries) => {
  return await dictionaries[locale]();
};
