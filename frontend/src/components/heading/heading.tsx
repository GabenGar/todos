import clsx from "clsx";
import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";

import styles from "./heading.module.scss";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;
type IHeadingLevel = (typeof HEADING_LEVELS)[number];

interface IProps
  extends IBaseComponentPropsWithChildren<
    "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  > {
  level: IHeadingLevel;
}

export const Heading = createBlockComponent(styles, Component);

function Component({ level, className, ...props }: IProps) {
  const finalClassName = clsx(styles[`h${level}`], className);

  switch (level) {
    case 1: {
      return <h1 className={finalClassName} {...props} />;
    }
    case 2: {
      return <h2 className={finalClassName} {...props} />;
    }
    case 3: {
      return <h3 className={finalClassName} {...props} />;
    }
    case 4: {
      return <h4 className={finalClassName} {...props} />;
    }
    case 5: {
      return <h5 className={finalClassName} {...props} />;
    }
    case 6: {
      return <h6 className={finalClassName} {...props} />;
    }

    default: {
      throw new Error(`Unknown heading level "${level satisfies never}".`);
    }
  }
}
