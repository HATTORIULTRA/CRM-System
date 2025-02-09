import { FC, ReactNode } from "react";
import { List } from "antd";

import TodoItem from "../TodoItem/TodoItem.tsx";
import { Todo } from "../../types/types.ts";

interface TodoListProps {
	todos: Todo[];
	fetchTodos: () => void;
}

const TodoList: FC<TodoListProps> = ({ todos, fetchTodos }): ReactNode => {
	console.log("list rerender");

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
