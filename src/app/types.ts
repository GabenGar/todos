import type { ILocale } from "#lib/internationalization";

export interface IBasePageProps {
  params: IBasePageParams;
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface IBasePageParams {
  lang: ILocale;
}
