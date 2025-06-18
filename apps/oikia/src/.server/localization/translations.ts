import type { ICommonTranslation, ILanguage, ITranslation } from "#lib/internationalization";

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

export async function getTranslation(locale: ILanguage): Promise<ITranslation> {
  return await translations[locale]();
}

export async function getCommonTranslation(locale: ILanguage, translation?: ITranslation): Promise<ICommonTranslation> {
  if (translation) {
    return translation.common
  }

  return (await translations[locale]())["common"];
}
