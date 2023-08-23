interface IProps {
  params: {
    todo_id: string;
  };
}

function TodoPage({ params }: IProps) {
  return <h1>Hello, TODO "{params.todo_id}"!</h1>;
}

export async function generateStaticParams() {
  const ids = ["1"].map((id) => {
    return {
      todo_id: id,
    };
  });

  return ids;
}

export default TodoPage;
