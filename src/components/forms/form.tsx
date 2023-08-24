import type { ReactNode } from "react";
import type { IBaseComponentProps } from "#components/types";

interface IProps extends IBaseComponentProps<"form"> {
  id: string;
  children?: (formID: string) => ReactNode;
}

export function Form({ id, className, onSubmit, children, ...props }: IProps) {
  const formID = `${id}-form`;

  return (
    <div id={id} className={className}>
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
