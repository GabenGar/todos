import type { IBaseComponentPropsWithChildren } from "#components/types";
import type { ITodo } from "./types";

interface IProps extends IBaseComponentPropsWithChildren<"li"> {
  todo: ITodo;
}

export function TodoItem({ todo, ...props }: IProps) {
  const { id, created_at, title, description } = todo;

  return (
    <li {...props}>
      {created_at}
      <br />
      {title}
      <br />
      {description}
    </li>
  );
}
