import { Loading } from "#loading";
import { Heading } from "#headings";
import {
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
  type IOverviewProps,
} from "./overview";

interface IProps extends Pick<IOverviewProps, "headingLevel"> {}

export function OverviewPlaceHolder({ ...props }: IProps) {
  return (
    <Overview {...props}>
      {(headinglevel) => (
        <>
          <OverviewHeader>
            <Heading level={headinglevel}>
              <Loading />
            </Heading>
          </OverviewHeader>
          <OverviewBody>
            <Loading />
          </OverviewBody>
          <OverviewFooter>
            <Loading />
          </OverviewFooter>
        </>
      )}
    </Overview>
  );
}
