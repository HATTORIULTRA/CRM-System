import { FC, ReactNode } from "react";

import TodoItem from "../TodoItem/TodoItem.tsx";
import { Todo } from "../../types/types.ts";
import s from "./TodoList.module.scss";

interface TodoListProps {
	todos: Todo[];
	fetchTodos: () => void;
}

const TodoList: FC<TodoListProps> = ({ todos, fetchTodos }): ReactNode => {
	return (
		<ul className={s.todoList}>
			{todos.map((item) => (
				<TodoItem fetchTodos={fetchTodos} key={item.id} {...item} />
			))}
		</ul>
	);
};

export default TodoList;
