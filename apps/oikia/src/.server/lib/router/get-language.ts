import { DEFAULT_LANGUAGE } from "#environment";
import { NotFoundError } from "#server/lib/errors";
import { type ILocale, isSupportedLanguage } from "#translation/lib";

interface ILanguageParams {
  language?: string;
}

export function getLanguage<Params extends ILanguageParams>(
  params: Params,
): ILocale {
  const language = params.language ?? DEFAULT_LANGUAGE;

  if (!isSupportedLanguage(language)) {
    throw new NotFoundError();
  }

  return language;
}
