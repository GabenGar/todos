const dictionaries = {
  en: async () => {
    const dictModule = await import("../../localization/en.json");
    return dictModule.default;
  },
  ru: async () => {
    const dictModule = await import("../../localization/ru.json");
    return dictModule.default;
  },
};

export const getDictionary = async (locale: keyof typeof dictionaries) => {
  return await dictionaries[locale]();
};
