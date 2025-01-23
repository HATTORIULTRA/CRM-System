import { FC, ReactNode, useState } from "react";

import TodoItem from "../TodoItem/TodoItem.tsx";
import { Todo } from "../../types/types.ts";
import s from "./TodoList.module.scss";

interface TodoListProps {
	todos: Todo[];
	fetchTodos: () => void;
}

const TodoList: FC<TodoListProps> = ({ todos, fetchTodos }): ReactNode => {
	const [todoIdForEdit, setTodoIdForEdit] = useState<number | null>(null);

	return (
		<ul className={s.todoList}>
			{todos.map((item) => (
				<TodoItem
					fetchTodos={fetchTodos}
					key={item.id}
					{...item}
					todoIdForEdit={todoIdForEdit}
					setTodoIdForEdit={setTodoIdForEdit}
				/>
			))}
		</ul>
	);
};

export default TodoList;
