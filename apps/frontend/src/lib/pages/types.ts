import type { ILocale } from "#lib/internationalization";

export interface IStaticPageProps {
  params: Promise<IBasePageParams>;
}

export interface IDynamicPageProps {
  params: Promise<IBasePageParams>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface IBasePageParams {
  lang: ILocale;
}
