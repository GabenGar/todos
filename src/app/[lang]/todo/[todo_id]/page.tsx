import type { Metadata, ResolvingMetadata } from "next";
import type { IBasePageProps } from "#pages/types";

interface IProps extends IBasePageProps {
  params: {
    todo_id: string;
  } & IBasePageProps["params"];
}

function TodoPage({ params }: IProps) {
  return <h1>Hello, TODO &quot;{params.todo_id}&quot;!</h1>;
}

export async function generateStaticParams() {
  const ids = ["1"].map((id) => {
    return {
      todo_id: id,
    };
  });

  return ids;
}

export async function generateMetadata(
  { params, searchParams }: IProps,
  parent?: ResolvingMetadata
): Promise<Metadata> {
  const id = params.todo_id;

  return {
    title: `TODO "${id}"`,
  };
}

export default TodoPage;
