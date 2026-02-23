import { promises as fs } from "node:fs";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { Page } from "#components";
import { Heading } from "#components/heading";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import { Pre } from "#components/pre";
import { getDictionary } from "#lib/localization";
import type { ILocalizedParams, ILocalizedProps } from "#lib/pages";
import { getStaticExportPaths } from "#server";

interface IProps extends ILocalizedProps<"yt-dlp-configs"> {
  windowsConfig: string;
  linuxConfig: string;
}

interface IParams extends ILocalizedParams {}

function YTDLPConfigsPage({
  translation,
  linuxConfig,
  windowsConfig,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = translation;

  const title = t.title;

  return (
    <Page heading={t.heading} title={title}>
      <Overview headingLevel={1}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              Full-ish `yt-dlp` configs because I always have to look up its
              docs to reproduce.
            </OverviewHeader>
            <OverviewBody>
              <Heading level={headingLevel + 1}>Linux</Heading>
              <Pre isCode>{linuxConfig}</Pre>

              <Heading level={headingLevel + 1}>Windows</Heading>
              <Pre isCode>{windowsConfig}</Pre>
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<IProps, IParams> = async ({
  params,
}) => {
  // biome-ignore lint/style/noNonNullAssertion: blah
  const { lang } = params!;
  const dict = await getDictionary(lang);
  const windowsConfig = await fs.readFile(
    `${process.cwd()}/src/pages/[lang]/yt-dlp-configs/windows.conf`,
    "utf8",
  );
  const linuxConfig = await fs.readFile(
    `${process.cwd()}/src/pages/[lang]/yt-dlp-configs/linux.conf`,
    "utf8",
  );

  const props = {
    translation: {
      lang,
      common: dict.common,
      t: dict.pages["yt-dlp-configs"],
    },
    windowsConfig,
    linuxConfig,
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default YTDLPConfigsPage;
