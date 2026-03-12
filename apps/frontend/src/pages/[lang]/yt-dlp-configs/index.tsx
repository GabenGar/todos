import { promises as fs } from "node:fs";
import type { InferGetStaticPropsType } from "next";
import { LinkExternal } from "@repo/ui/links";
import { Page } from "#components";
import { Heading } from "#components/heading";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import { Pre } from "#components/pre";
import { usePageTranslation } from "#hooks";
import type { ILocalizedParams, ILocalizedProps } from "#lib/pages";
import { createGetStaticProps, getStaticExportPaths } from "#server";

interface IProps extends ILocalizedProps {
  windowsConfig: string;
  linuxConfig: string;
}

interface IParams extends ILocalizedParams {}

function YTDLPConfigsPage({
  linuxConfig,
  windowsConfig,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = usePageTranslation("page-yt-dlp-configs");
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={1}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              Full-ish{" "}
              <LinkExternal href={"https://github.com/79589310/307260205"}>
                `yt-dlp`
              </LinkExternal>{" "}
              configs because I always have to look up its docs to reproduce.
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

export const getStaticProps = createGetStaticProps<IProps, IParams>(
  "page-yt-dlp-configs",
  async (_, langProps) => {
    const windowsConfig = await fs.readFile(
      `${process.cwd()}/src/pages/[lang]/yt-dlp-configs/windows.conf`,
      "utf8",
    );
    const linuxConfig = await fs.readFile(
      `${process.cwd()}/src/pages/[lang]/yt-dlp-configs/linux.conf`,
      "utf8",
    );

    const props = {
      ...langProps,
      windowsConfig,
      linuxConfig,
    } satisfies IProps;

    return props;
  },
);

export const getStaticPaths = getStaticExportPaths;

export default YTDLPConfigsPage;
