import clsx from "clsx";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";

import styles from "./heading.module.scss";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;
export type IHeadingLevel = (typeof HEADING_LEVELS)[number];

interface IProps
  extends IBaseComponentPropsWithChildren<
    "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  > {
  level: IHeadingLevel | (number & {});
}

export const Heading = createBlockComponent(styles, Component);

function Component({ level, className, ...props }: IProps) {
  const finalClassName = clsx(styles[`h${level}`], className);

  validateHeadinglevel(level);

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

export function validateHeadinglevel(
  inputLevel: unknown,
): asserts inputLevel is IHeadingLevel {
  if (!HEADING_LEVELS.includes(inputLevel as IHeadingLevel)) {
    throw new Error(`Unknown heading level "${inputLevel}".`);
  }
}
