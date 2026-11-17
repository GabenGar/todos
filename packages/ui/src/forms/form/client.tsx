import { type ReactNode, Suspense, useEffect, useState } from "react";
import { ButtonSubmit } from "@repo/ui/buttons";
import { createBlockComponent } from "@repo/ui/meta";
import { isError, validateError } from "#errors";
import { Preformatted } from "#formatting";
import { useClient, useTranslation } from "#hooks";
import { List, ListItem } from "#lists";
import { Loading } from "#loading";
import { type IProgress, ProgressBar } from "#progress";
import { InputSection } from "../sections";
import { Form } from "./form";
import type { IFormEvent, IFormProps } from "./types";
//

import styles from "./client.module.scss";

export interface IFormClientProps< InputName extends string = string >
  extends Omit< IFormProps< InputName >, "children" | "submitButton" > {
  id: string;
  children?: ( formID: string, isSubmitting: boolean ) => ReactNode;
  isNested?: boolean;
  onSubmit: ( event: IFormEvent< InputName > ) => Promise< void >;
  onReset?: ( event: IFormEvent< InputName > ) => Promise< void >;
  submitButton?:
    | false
    | ( ( formID: string, isSubmitting: boolean ) => ReactNode );
  isResetOnSuccess?: boolean;
  progress?: IProgress;
}

type IFormStatus = "initializing" | "ready" | "submitting";

/**
 * Client-only form.
 */
export const FormClient = createBlockComponent( undefined, Component );

function Component< InputName extends string >( {
  id,
  isNested,
  className,
  submitButton,
  onSubmit,
  onReset,
  isResetOnSuccess = true,
  children,
  progress,
  ...props
}: IFormClientProps< InputName > ) {
  const { t } = useTranslation();
  const client = useClient();
  const [ formStatus, changeFormStatus ] = useState< IFormStatus >(
    ! client ? "initializing" : "ready",
  );
  const [ errors, changeErrors ] = useState< ( Error | string )[] >();
  const progressID = `${ id }-progress`;
  const isSubmitting = formStatus === "submitting";

  useEffect( () => {
    changeFormStatus( ! client ? "initializing" : "ready" );
  }, [ client ] );

  async function handleSubmit( event: IFormEvent< InputName > ) {
    event.preventDefault();

    if ( isSubmitting ) {
      return;
    }

    changeFormStatus( "submitting" );
    changeErrors( undefined );

    try {
      await onSubmit?.( event );

      if ( isResetOnSuccess ) {
        await handleReset( event );
      }
    } catch ( error ) {
      validateError( error );
      changeErrors( [ error ] );
    } finally {
      changeFormStatus( "ready" );
    }
  }

  async function handleReset( event: IFormEvent< InputName > ) {
    if ( isSubmitting ) {
      return;
    }

    try {
      changeFormStatus( "submitting" );
      await onReset?.( event );
      ( event.target as HTMLFormElement ).reset();
    } finally {
      changeFormStatus( "ready" );
    }
  }

  return (
    <Suspense fallback={ <Loading /> }>
      <Form
        id={ id }
        onSubmit={ handleSubmit }
        onReset={ handleReset }
        submitButton={ false }
        { ...props }
      >
        { ( formID ) => (
          <>
            { children?.( formID, isSubmitting ) }
            { errors && (
              <List isOrdered>
                { errors.map( ( error, index ) => (
                  <ListItem key={ index }>
                    <Preformatted>
                      { isError( error ) ? String( error ) : error }
                    </Preformatted>
                  </ListItem>
                ) ) }
              </List>
            ) }

            <InputSection>
              <ProgressBar
                id={ progressID }
                current={ progress?.current ?? 0 }
                total={ progress?.total ?? 1 }
              >
                { t( ( t ) => t.form.state[ formStatus ] ) }
              </ProgressBar>
            </InputSection>

            {
              // don't render the button at all if `false`
              submitButton === false ? undefined : (
                <InputSection className={ styles.submit }>
                  { /* render default button if not a function */ }
                  { submitButton === undefined ? (
                    <ButtonSubmit
                      form={ formID }
                      viewType={ isNested ? "button" : "submit" }
                      disabled={ isSubmitting }
                    >
                      { t( ( t ) => t.form.state.submit ) }
                    </ButtonSubmit>
                  ) : (
                    <CustomButton
                      formID={ formID }
                      isNested={ isNested }
                      isSubmitting={ isSubmitting }
                      submitButton={ submitButton }
                    />
                  ) }
                </InputSection>
              )
            }
          </>
        ) }
      </Form>
    </Suspense>
  );
}

interface ICustomButtonProps extends Pick< IFormProps, "isNested" > {
  formID: string;
  isSubmitting: boolean;
  submitButton: ( formID: string, isSubmitting: boolean ) => ReactNode;
}

function CustomButton( {
  formID,
  isNested,
  isSubmitting,
  submitButton,
}: ICustomButtonProps ) {
  const result = submitButton( formID, isSubmitting );

  // render custom button if result is not a string
  if ( typeof result !== "string" ) {
    return <>{ result }</>;
  }

  return (
    <ButtonSubmit
      form={ formID }
      viewType={ isNested ? "button" : "submit" }
      disabled={ isSubmitting }
    >
      { result }
    </ButtonSubmit>
  );
}
