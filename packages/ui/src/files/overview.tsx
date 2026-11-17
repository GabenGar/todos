import {
  type IOverviewProps,
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
} from "@repo/ui/articles";
import { DateTimeView, toISODateTime } from "#dates";
import { DescriptionList, DescriptionSection } from "#description-list";
import { Preformatted } from "#formatting";
import { Heading } from "#headings";
import { useTranslation } from "#hooks";
import { createBlockComponent } from "#meta";
import { DigitalSize } from "#numbers";
import type { IFileOverview } from "./types";
import { parseString } from "#strings";
import { ButtonCopy } from "#buttons";

interface IProps extends IOverviewProps {
  overview: IFileOverview;
}

export const FileOverview = createBlockComponent( undefined, Component );

function Component( { overview, ...props }: IProps ) {
  const { t } = useTranslation();
  const { file, hashes } = overview;
  const { name, type, size, lastModified } = file;
  const lastModifiedDateTime = toISODateTime( new Date( lastModified ) );
  const parsedType = parseString( type );

  return (
    <Overview { ...props }>
      { ( headingLevel ) => (
        <>
          <OverviewHeader>
            <Heading level={ headingLevel }>
              <Preformatted>{ name }</Preformatted>
            </Heading>
          </OverviewHeader>

          <OverviewBody>
            <DescriptionList>
              <DescriptionSection
                dKey={ t( ( t ) => t.file.type ) }
                dValue={ parsedType }
                isKeyPreformatted
                isValuePreformatted
                isHorizontal
              />

              <DescriptionSection
                dKey={ t( ( t ) => t.file.size ) }
                dValue={ <DigitalSize size={ size } /> }
                isKeyPreformatted
                isHorizontal
              />

              <DescriptionSection
                dKey={ t( ( t ) => t.file.hashes ) }
                dValue={
                  <DescriptionList isNested>
                    { Object.entries( hashes ).map( ( [ key, value ] ) => (
                      <DescriptionSection
                        key={ key }
                        dKey={ key }
                        dValue={
                          <>
                            { value } <ButtonCopy valueToCopy={ value } />
                          </>
                        }
                        isKeyPreformatted
                        isValuePreformatted
                      />
                    ) ) }
                  </DescriptionList>
                }
                isKeyPreformatted
              />
            </DescriptionList>
          </OverviewBody>

          <OverviewFooter>
            <DescriptionList>
              <DescriptionSection
                dKey={ t( ( t ) => t.file[ "last-modified" ] ) }
                dValue={ <DateTimeView dateTime={ lastModifiedDateTime } /> }
                isKeyPreformatted
              />
            </DescriptionList>
          </OverviewFooter>
        </>
      ) }
    </Overview>
  );
}
