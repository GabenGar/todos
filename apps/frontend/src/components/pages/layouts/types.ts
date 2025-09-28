import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ILocalizedProps } from "#lib/pages";

interface IBaseProps extends ILocalizedProps {}

export type NextPageWithLayout<
  Props = IBaseProps,
  InitialProps = Props,
> = NextPage<Props, InitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps<IBaseProps> & {
  Component: NextPageWithLayout;
};
