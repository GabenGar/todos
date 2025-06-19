import type {
  ICommonTranslation,
  ILanguage,
  ITranslation,
} from "#lib/internationalization";

const translations = {
  en: async () => {
    const dictModule = await import("#localization/en");
    return dictModule.default;
  },
  ru: async () => {
    const dictModule = await import("#localization/ru");
    return dictModule.default;
  },
} satisfies Record<ILanguage, () => Promise<ITranslation>>;

export async function getTranslation(
  language: ILanguage,
): Promise<ITranslation> {
  return await translations[language]();
}

export async function getCommonTranslation(
  language: ILanguage,
  translation?: ITranslation,
): Promise<ICommonTranslation> {
  if (translation) {
    return translation.common;
  }

  return (await translations[language]())["common"];
}
