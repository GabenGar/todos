import type { ILocalizedArgs, ILocalizedProps } from "#lib/pages";
import { getTranslation } from "#translation/lib";
import { getLanguage } from "./get-language";

export function createLocalizedLoader<
  Props extends ILocalizedProps,
  Args extends ILocalizedArgs,
>(
  loaderFunc?: (args: Args, localizedProps: ILocalizedProps) => Promise<Props>,
) {
  async function loader(loaderArgs: Args): Promise<Props> {
    const language = getLanguage(loaderArgs.params);
    const translation = await getTranslation(language);
    const localizedProps = {
      language,
      translation,
    };

    const props = !loaderFunc
      ? localizedProps
      : await loaderFunc(loaderArgs, localizedProps);
    // @ts-expect-error something something generics
    return props;
  }

  return loader;
}
