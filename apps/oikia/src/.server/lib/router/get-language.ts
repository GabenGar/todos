import {
  isSupportedLanguage,
  type ILanguage,
  DEFAULT_LANGUAGE,
} from "#lib/internationalization";
import { NotFoundError } from "../errors";

interface ILanguageParams {
  language?: string;
}

export function getLanguage<Params extends ILanguageParams>(
  params: Params,
): ILanguage {
  const language = params.language ?? DEFAULT_LANGUAGE;

  if (!isSupportedLanguage(language)) {
    throw new NotFoundError();
  }

  return language;
}
