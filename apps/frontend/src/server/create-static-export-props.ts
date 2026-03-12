import type { GetStaticProps, GetStaticPropsContext } from "next";
import { getTranslation, type IPageNamespace } from "#lib/internationalization";
import type { ILocalizedParams, ILocalizedProps } from "#lib/pages";

export function createGetStaticProps<
  Props extends ILocalizedProps,
  Params extends ILocalizedParams,
>(
  pageNamespace: IPageNamespace,
  callback?: (
    context: GetStaticPropsContext<Params>,
    langProps: ILocalizedProps,
  ) => Promise<Props>,
): GetStaticProps<Props, Params> {
  return async (context) => {
    const lang = context.params?.lang;

    if (!lang) {
      throw new Error(`Path parameter "[lang]" is required.`);
    }

    const translation = await getTranslation(lang, pageNamespace);
    const langProps: ILocalizedProps = {
      lang,
      translation,
    };
    // @ts-expect-error something something generic type
    const props: Props = !callback
      ? langProps
      : { ...(await callback(context, langProps)), ...langProps };

    return {
      props,
    };
  };
}
