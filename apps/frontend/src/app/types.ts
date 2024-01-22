import type { ILocale } from "#lib/internationalization";

export interface IStaticPageProps {
  params: IBasePageParams;
}

export interface IDynamicPageProps {
  params: IBasePageParams;
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface IBasePageParams {
  lang: ILocale;
}
