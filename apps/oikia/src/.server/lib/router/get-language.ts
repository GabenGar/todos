import { isSupportedLanguage, type ILanguage } from "#lib/internationalization";
import { NotFoundError } from "../errors";

interface ILanguageParams {
  language: string;
}

export function getLanguage<Params extends ILanguageParams>(
  params: Params,
): ILanguage {
  const { language } = params;

  if (!isSupportedLanguage(language)) {
    throw new NotFoundError();
  }

  return language;
}
