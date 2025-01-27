import { FC, ReactNode, useEffect, useState } from "react";
import { requestFilteredTodos } from "./api/api.ts";
import { Todo, TodoInfo } from "./types/types.ts";

import TodoForm from "./components/TodoForm/TodoForm.tsx";
import TodoFilters from "./components/TodoFilters/TodoFilters.tsx";
import TodoList from "./components/TodoList/TodoList.tsx";
import TodoLoading from "./components/TodoLoading/TodoLoading.tsx";

const App: FC = (): ReactNode => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [categoryCount, setCategoryCount] = useState<TodoInfo>({
		all: 0,
		completed: 0,
		inWork: 0,
	});

	const fetchTodos = async (filter: keyof TodoInfo = "all") => {
		try {
			const res = await requestFilteredTodos(filter);

			setTodos(res.data);
			setCategoryCount(res.info!);
			setIsLoading(false);
		} catch (error) {
			console.error("Fetching todos error", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	return (
		<div className="app">
			<TodoForm fetchTodos={fetchTodos} />
			<TodoFilters categoryCount={categoryCount} fetchTodos={fetchTodos} />
			{isLoading ? (
				<TodoLoading />
			) : (
				<TodoList todos={todos} fetchTodos={fetchTodos} />
			)}
		</div>
	);
};

export default App;
