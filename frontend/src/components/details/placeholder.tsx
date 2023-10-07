import { Loading } from "#components";
import { Heading } from "#components/heading";
import {
  Details,
  DetailsBody,
  DetailsFooter,
  DetailsHeader,
  IDetailsProps,
} from "./details";

interface IProps extends Pick<IDetailsProps, "headingLevel"> {}

export function DetailsPlaceHolder({ ...props }: IProps) {
  return (
    <Details {...props}>
      {(headinglevel) => (
        <>
          <DetailsHeader>
            <Heading level={headinglevel}>
              <Loading />
            </Heading>
          </DetailsHeader>
          <DetailsBody>
            <Loading />
          </DetailsBody>
          <DetailsFooter>
            <Loading />
          </DetailsFooter>
        </>
      )}
    </Details>
  );
}
