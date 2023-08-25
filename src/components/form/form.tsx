import type { ReactNode } from "react";
import type { IBaseComponentProps } from "#components/types";

import styles from "./form.module.scss"

interface IProps extends IBaseComponentProps<"form"> {
  id: string;
  children?: (formID: string) => ReactNode;
}

export function Form({ id, className, onSubmit, children, ...props }: IProps) {
  const formID = `${id}-form`;

  return (
    <div id={id} className={styles.block}>
      {children(formID)}
      <form
        {...props}
        id={formID}
        onSubmit={
          !onSubmit
            ? undefined
            : (event) => {
                event.preventDefault();
                onSubmit(event);
              }
        }
      />
    </div>
  );
}
