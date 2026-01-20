import { Component, ReactNode, ErrorInfo } from "react";
import {
  Overview,
  OverviewHeader,
  OverviewBody,
  OverviewFooter,
} from "@repo/ui/articles";
import { Heading } from "@repo/ui/headings";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { ButtonCopy } from "@repo/ui/buttons";
import { createRootPageURL } from "#lib/urls";
import { LinkInternal } from "#components/link";

import styles from "./boundary.module.scss";

interface IProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

type IState = { extra?: { error: Error; errorInfo: ErrorInfo } } & (
  | { hasError: false }
  | { error: Error; hasError: true }
);

/**
 * @TODO localization
 */
export class ErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): IState {
    return { error, hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ ...this.state, extra: { error, errorInfo } });
  }

  render() {
    const { props, state } = this;

    if (!state.hasError) {
      return props.children;
    }

    const serializedError = JSON.stringify({
      error: {
        name: state.error.name,
        message: state.error.message,
        stack: state.error.stack,
        cause: String(state.error.cause),
      },
      extra: {
        error: String(state.extra?.error),
        digest: state.extra?.errorInfo.digest,
        componentStack: state.extra?.errorInfo.componentStack,
      },
    });

    return (
      <main className={styles.main}>
        <Overview headingLevel={2}>
          {() => (
            <>
              <OverviewHeader>
                <Heading level={1}>Error</Heading>
              </OverviewHeader>

              <OverviewBody>
                <DescriptionList>
                  <DescriptionSection
                    dKey={"Name"}
                    dValue={state.error.name}
                    isKeyPreformatted
                    isValuePreformatted
                    isHorizontal
                  />

                  <DescriptionSection
                    dKey={"Message"}
                    dValue={state.error.message}
                    isKeyPreformatted
                    isValuePreformatted
                    isHorizontal
                  />

                  {/* {!state.error.stack ? undefined : (
                    <DescriptionSection
                      dKey={"Call Stack"}
                      dValue={state.error.stack}
                      isKeyPreformatted
                      isValuePreformatted
                    />
                  )} */}

                  {!state.error.cause ? undefined : (
                    <DescriptionSection
                      dKey={"Cause"}
                      dValue={String(state.error.cause)}
                      isKeyPreformatted
                      isValuePreformatted
                    />
                  )}

                  {!state.extra ? undefined : (
                    <DescriptionSection
                      dKey={"Extra data"}
                      dValue={
                        <DescriptionList isNested>
                          <DescriptionSection
                            dKey={"Error"}
                            dValue={String(state.extra.error)}
                            isKeyPreformatted
                          />

                          {!state.extra.errorInfo.digest ? undefined : (
                            <DescriptionSection
                              dKey={"Digest"}
                              dValue={String(state.extra.errorInfo.digest)}
                              isKeyPreformatted
                              isValuePreformatted
                              isHorizontal
                            />
                          )}

                          {/* {state.extra.errorInfo.componentStack ?? (
                            <DescriptionSection
                              dKey={"Component Stack"}
                              dValue={String(
                                state.extra.errorInfo.componentStack,
                              )}
                              isKeyPreformatted
                              isValuePreformatted
                            />
                          )} */}
                        </DescriptionList>
                      }
                    />
                  )}
                </DescriptionList>

                <ButtonCopy
                  translation={{ ["Copied"]: "Copied", ["Copy"]: "Copy" }}
                  valueToCopy={serializedError}
                />
              </OverviewBody>

              <OverviewFooter>
                <LinkInternal href={createRootPageURL()}>
                  Return to home page
                </LinkInternal>
              </OverviewFooter>
            </>
          )}
        </Overview>
      </main>
    );
  }
}
