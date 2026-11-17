import { Preformatted } from "#formatting";
import { Label } from "#forms";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";
import type { IRequiredSome } from "#types";
//

import styles from "./progress.module.scss";

interface IProps
  extends IRequiredSome< IBaseComponentPropsWithChildren< "div" >, "id" > {
  current?: number;
  total: number;
}

export const ProgressBar = createBlockComponent( styles.block, Component );

function Component( { id, current, total, children, ...props }: IProps ) {
  const ratio = total === 0 ? 0 : ( current ?? 0 / total );

  return (
    <div { ...props }>
      <progress
        id={ id }
        className={ styles.progress }
        value={ current }
        max={ total }
      >
        <Preformatted>{ ratio }</Preformatted>
      </progress>
      <Label htmlFor={ id } separator={ "" }>
        { children }
      </Label>
    </div>
  );
}
