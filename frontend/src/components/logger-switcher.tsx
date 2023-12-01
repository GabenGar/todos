"use client";
import type { ILocalization } from "#lib/localization";
import { useClient } from "#hooks";
import { Loading } from "./loading";
import { DescriptionList, DescriptionSection } from "./description-list";

import styles from "./logger-switcher.module.scss";

interface IProps {
  translation: ILocalization["layout"];
}

export function LoggerSwitcher({ translation }: IProps) {
  const clientInfo = useClient();
  const loggerTranslation = translation.logger;
  const logLevelTranslation = {
    debug: "Debug",
    log: "Logs",
    info: "Information",
    warn: "Warnings",
    error: "Errors",
  } as const;

  return (
    <DescriptionList>
      <DescriptionSection
        isHorizontal
        dKey={loggerTranslation["Log level"]}
        dValue={
          !clientInfo.isClient ? (
            <Loading />
          ) : (
            <span className={styles[clientInfo.logLevel]}>
              {
                loggerTranslation.levels[
                  logLevelTranslation[clientInfo.logLevel]
                ]
              }
            </span>
          )
        }
      />
    </DescriptionList>
  );
}
