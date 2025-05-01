// Error components must be Client Components
"use client";

import { useEffect } from "react";
import { logError } from "#lib/logs";
import { Button } from "#components/button";
import { Heading } from "#components/heading";

/**
 * @TODO multilang
 */
function PageError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    logError(error);
  }, [error]);

  return (
    <div>
      <Heading level={2}>Something went wrong!</Heading>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}

export default PageError;
