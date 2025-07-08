import iso6391 from "iso-639-1";
import { createBlockComponent, type IBaseComponentProps } from "#meta";

import styles from "./language.module.scss";

interface IProps extends IBaseComponentProps<"span"> {
  language: string;
}

export const Language = createBlockComponent(undefined, Component);

function Component({ language, ...props }: IProps) {
  return (
    <span {...props}>
      <span className={styles.language}>{language}</span>{" "}
      {iso6391.getNativeName(language)} ({iso6391.getName(language)})
    </span>
  );
}
