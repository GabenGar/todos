import { useState } from "react";
import { calculateHashes } from "@repo/core/hashes";
import type { IProgress } from "@repo/core/progress";
import { sleep } from "@repo/core/utils";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { FileOverview, type IFileOverview } from "@repo/ui/files";
import { FormClient, type IFormEvent } from "@repo/ui/forms";
import {
  InputSectionCheckBox,
  InputSectionFile,
} from "@repo/ui/forms/sections";
import { Page } from "#components";
import { usePageTranslation } from "#hooks";
import { createGetStaticProps, getStaticExportPaths } from "#server";
import type { IPageNamespace } from "#translation";

const namespace = "page-file-analyzer" satisfies IPageNamespace;

function QRCodeReaderPage() {
  const { t } = usePageTranslation( namespace );
  const [ fileOverview, changeFileOverview ] = useState< IFileOverview >();
  const title = t( ( t ) => t.title );
  const heading = t( ( t ) => t.heading );
  const formID = "file-analyzer";

  return (
    <Page heading={ heading } title={ title }>
      <Overview headingLevel={ 2 }>
        { () => (
          <>
            <OverviewHeader isFilled>
              <FileForm
                id={ formID }
                onSuccess={ async ( overview ) =>
                  changeFileOverview( overview )
                }
              />
            </OverviewHeader>

            { ! fileOverview ? undefined : (
              <OverviewBody>
                <FileOverview headingLevel={ 3 } overview={ fileOverview } />
              </OverviewBody>
            ) }
          </>
        ) }
      </Overview>
    </Page>
  );
}

interface IFileProps {
  id: string;
  onSuccess: ( overview: IFileOverview ) => Promise< void >;
}

function FileForm( { id, onSuccess }: IFileProps ) {
  const { t } = usePageTranslation( namespace );
  const [ progress, changeProgress ] = useState< IProgress >();
  const FIELD = {
    FILE: { name: "file", label: t( ( t ) => t.form.file.label ) },
    SHOW_PROGRESS: {
      name: "is-showing-progress",
      label: t( ( t ) => t.form[ "show-progress" ].label ),
    },
  } as const;
  type IFieldName = ( typeof FIELD )[ keyof typeof FIELD ][ "name" ];

  async function handleProgress( current: number, total: number ) {
    if ( ! progress ) {
      changeProgress( { current, total } );
      await sleep();
      return;
    }

    if ( current === progress.current ) {
      return;
    }

    const currentRatio = progress.current / total;
    const nextRatio = current / total;
    const increment = nextRatio - currentRatio;
    const incrementThreshold = 0.5;

    if ( increment < incrementThreshold ) {
      return;
    }

    changeProgress( { current, total } );
    await sleep();
  }

  async function handleSubmit( event: IFormEvent< IFieldName > ) {
    const elements = event.currentTarget.elements;
    const isProgressShown = elements[ "is-showing-progress" ].checked;
    const filesInput = event.currentTarget.elements.file;
    const files = filesInput.files;

    if ( files === null ) {
      return;
    }

    // biome-ignore lint/style/noNonNullAssertion: blah
    const file = files.item( 0 )!;

    isProgressShown && changeProgress( { current: 0, total: file.size } );

    const hashes = await calculateHashes(
      file,
      ! isProgressShown ? undefined : handleProgress,
    );
    const overview = { file, hashes } satisfies IFileOverview;

    await onSuccess( overview );
    changeProgress( undefined );
  }

  return (
    <FormClient< IFieldName >
      id={ id }
      onSubmit={ handleSubmit }
      submitButton={ ( _, isSubmitting ) =>
        t( ( t ) => ( isSubmitting ? t.form.submitting : t.form.submit ) )
      }
    >
      { ( formID ) => (
        <>
          <InputSectionFile
            id={ `${ formID }-${ FIELD.FILE.name }` }
            form={ formID }
            name={ FIELD.FILE.name }
            label={ FIELD.FILE.label }
            multiple={ false }
            required
          />

          <InputSectionCheckBox
            id={ `${ formID }-${ FIELD.SHOW_PROGRESS.name }` }
            form={ formID }
            name={ FIELD.SHOW_PROGRESS.name }
            defaultChecked
          >
            { FIELD.SHOW_PROGRESS.label }
          </InputSectionCheckBox>
        </>
      ) }
    </FormClient>
  );
}

export const getStaticProps = createGetStaticProps( namespace );
export const getStaticPaths = getStaticExportPaths;

export default QRCodeReaderPage;
