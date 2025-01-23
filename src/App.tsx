import { FC, ReactNode, useEffect, useState } from "react";
import { httpRequest } from "./api/api.ts";
import { ICategoryCount, Todo } from "./types/types.ts";

import TodoForm from "./components/TodoForm/TodoForm.tsx";
import TodoFilters from "./components/TodoFilters/TodoFilters.tsx";
import TodoList from "./components/TodoList/TodoList.tsx";
import TodoLoading from "./components/TodoLoading/TodoLoading.tsx";

const App: FC = (): ReactNode => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [categoryCount, setCategoryCount] = useState<ICategoryCount>({
		all: 0,
		completed: 0,
		inWork: 0,
	});

	const fetchTodos = async (filter: string = "all") => {
		try {
			const res = await httpRequest(filter);

			setTodos(res.data);
			setCategoryCount(res.info!);
			setIsLoading(false);

			return res.info!;
		} catch (error) {
			console.error("Fetching todos error", error);
			return { all: 0, completed: 0, inWork: 0 };
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
