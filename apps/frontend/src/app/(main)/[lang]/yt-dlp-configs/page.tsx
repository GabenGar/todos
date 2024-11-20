import { promises as fs } from "node:fs";
import { getDictionary } from "#server";
import { Page } from "#components";
import type { IBasePageParams } from "#pages/types";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import { Heading } from "#components/heading";
import { Pre } from "#components/pre";

interface IProps {
  params: IBasePageParams;
}

export async function generateMetadata({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { title } = dict.pages["yt-dlp-configs"];

  return {
    title,
  };
}

async function YTDLPConfigsPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { common, pages } = dict;
  const { heading } = pages["yt-dlp-configs"];
  const windowsConfig = await fs.readFile(
    process.cwd() + "/src/app/(main)/[lang]/yt-dlp-configs/windows.conf",
    "utf8",
  );
  const linuxConfig = await fs.readFile(
    process.cwd() + "/src/app/(main)/[lang]/yt-dlp-configs/linux.conf",
    "utf8",
  );

  return (
    <Page heading={heading}>
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

export default YTDLPConfigsPage;
