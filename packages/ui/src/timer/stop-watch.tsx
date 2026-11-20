import { useState } from "react";
import { useInterval } from "#hooks";
import { createBlockComponent, type IBaseComponentProps } from "#meta";

interface IProps extends IBaseComponentProps< "span" > {
  startTime: number;
  endTime?: number;
}

export const StopWatch = createBlockComponent( undefined, Component );

function Component( { startTime, endTime, ...props }: IProps ) {
  const [ currentTime, changeCurrentTime ] = useState( startTime );

  useInterval(
    () => {
      changeCurrentTime( Date.now() );
    },
    endTime !== undefined ? 1000 : null,
  );

  return <span { ...props }>{ currentTime - startTime }</span>;
}
