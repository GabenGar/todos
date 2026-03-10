import type { GetStaticProps } from "next";
import { getTranslation, type IPageNamespace } from "#lib/internationalization";
import type { ILocalizedParams, ILocalizedProps } from "#lib/pages";

export function createGetStaticProps<
  Props extends ILocalizedProps,
  Params extends ILocalizedParams,
>(
  pageNamespace: IPageNamespace,
  callback?: GetStaticProps<Props, Params>,
): GetStaticProps<Props, Params> {
  return async (context) => {
    const lang = context.params?.lang;

    if (!lang) {
      throw new Error(`Path parameter "[lang]" is required.`);
    }

    const translation = await getTranslation(lang, pageNamespace);
    // @ts-expect-error something something generic type
    const props: Props = !callback
      ? {
          lang,
          translation,
        }
      : await callback(context);

    return {
      props,
    };
  };
}
