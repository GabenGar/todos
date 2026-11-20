import { useEffect, useRef } from "react";

/**
 * Written by the [Reactman himself][1].
 * Surely it means it's perfect.
 * [1]: https://overreacted.io/making-setinterval-declarative-with-react-hooks
 * @param func A function to run each interval
 * @param delay Duration of each interval.
 * @default 1000
 */
export function useInterval( func: () => void, delay: number | null = 1000 ) {
  const savedFunc = useRef< () => void >( undefined );

  // Remember the latest callback.
  useEffect( () => {
    if ( savedFunc.current ) {
      savedFunc.current = func;
    }
  }, [ func ] );

  // Set up the interval.
  useEffect( () => {
    function tick() {
      savedFunc.current?.();
    }

    if ( delay !== null ) {
      const id = setInterval( tick, delay );

      return () => clearInterval( id );
    }
  }, [ delay ] );
}
