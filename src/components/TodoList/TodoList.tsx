import { FC, ReactNode } from "react";
import { List } from "antd";

import TodoItem from "../TodoItem/TodoItem.tsx";
import { Todo } from "../../types/apiTypes.ts";

interface TodoListProps {
  todos: Todo[];
  fetchTodos: () => void;
}

const TodoList: FC<TodoListProps> = ({ todos, fetchTodos }): ReactNode => {
  return (
    <List
      size="large"
      bordered
      dataSource={todos}
      renderItem={(item) => (
        <TodoItem fetchTodos={fetchTodos} key={item.id} item={item} />
      )}
    />
  );
};

export default TodoList;
