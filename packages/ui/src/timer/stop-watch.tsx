import { useEffect, useState } from "react";
import { type IPreformattedProps, Preformatted } from "#formatting";
import { createBlockComponent } from "#meta";

interface IProps extends IPreformattedProps {
  startTime?: number;
  endTime?: number;
}

export const StopWatch = createBlockComponent( undefined, Component );

function Component( { startTime, endTime, ...props }: IProps ) {
  const [ currentTime, changeCurrentTime ] = useState< number >( 0 );
  const parsedTime = ! startTime ? 0 : Math.floor( currentTime / 1000 );

  useEffect( () => {
    let id: number | undefined = undefined;

    if ( ! startTime ) {
      clearInterval( id );
      changeCurrentTime( 0 );

      return;
    }

    if ( endTime ) {
      clearInterval( id );
      changeCurrentTime( endTime - startTime );

      return;
    }

    id = setInterval( () => {
      changeCurrentTime( Date.now() - startTime );
    }, 1000 );

    return () => clearInterval( id );
  }, [ startTime, endTime ] );

  return <Preformatted { ...props }>{ parsedTime }</Preformatted>;
}
