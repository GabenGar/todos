"use client";
import type { ILocalization } from "#lib/localization";
import { useClient } from "#hooks";
import { Loading } from "./loading";

interface IProps {
  translation: ILocalization["layout"];
}

export function LoggerSwitcher({ translation }: IProps) {
  const clientInfo = useClient();

  return !clientInfo.isClient ? (
    <Loading />
  ) : (
    <>
      {translation.log_level}: {clientInfo.logLevel}
    </>
  );
}
