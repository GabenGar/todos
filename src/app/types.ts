import type { ReactNode } from "react";
import type { ILocale } from "#lib/internationalization";

export interface IBaseLayoutProps {
  children: ReactNode;
}

export interface IBasePageProps {
  params: IBasePageParams;
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface IBasePageParams {
  lang: ILocale;
}
