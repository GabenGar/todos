"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { logError } from "#lib/logs";
import { Heading } from "#components/heading";
import { Button } from "#components/button";

interface IProps {
  error: Error;
  reset: () => void;
}

/**
 * @TODO multilang
 */
function GlobalError({ error, reset }: IProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    logError(error);
  }, [error]);

  return (
    <html>
      <body>
        <Heading level={2}>Something went wrong!</Heading>
        <Button onClick={() => reset()}>Try again</Button>
      </body>
    </html>
  );
}

export default GlobalError;
