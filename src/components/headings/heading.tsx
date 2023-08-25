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

export function Heading({ level, ...props }: IProps) {
  const className = `${styles.block} ${styles[`h${level}`]}`;

  switch (level) {
    case 1: {
      return <h1 className={className} {...props} />;
    }
    case 2: {
      return <h2 {...props} />;
    }
    case 3: {
      return <h3 {...props} />;
    }
    case 4: {
      return <h4 {...props} />;
    }
    case 5: {
      return <h5 {...props} />;
    }
    case 6: {
      return <h6 {...props} />;
    }

    default: {
      throw new Error(`Unknown heading level "${level satisfies never}".`);
    }
  }
}
