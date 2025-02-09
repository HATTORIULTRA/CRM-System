import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { Todo, TodoInfo } from "../../types/types.ts";
import { requestFilteredTodos } from "../../api/api.ts";

import s from "./TodoPage.module.scss";
import TodoForm from "../../components/TodoForm/TodoForm.tsx";
import TodoFilters from "../../components/TodoFilters/TodoFilters.tsx";
import TodoLoading from "../../components/TodoLoading/TodoLoading.tsx";
import TodoList from "../../components/TodoList/TodoList.tsx";

const TodoPage: FC = (): ReactNode => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [categoryCount, setCategoryCount] = useState<TodoInfo>({
		all: 0,
		completed: 0,
		inWork: 0,
	});

	const fetchTodos = useMemo(
		() =>
			async (filter: keyof TodoInfo = "all") => {
				try {
					const res = await requestFilteredTodos(filter);
					setTodos(res.data);
					setCategoryCount(res.info!);
				} catch (error) {
					console.error("Fetching todos error", error);
				} finally {
					setIsLoading(false);
				}
			},
		[todos]
	);

	useEffect(() => {
		fetchTodos();
	}, []);

	// useEffect(() => {
	// 	const fetchTimer = setInterval(() => {
	// 		const filter = localStorage.getItem("filter") as keyof TodoInfo;
	// 		fetchTodos(filter);
	// 	}, 5000);
	// 	return () => {
	// 		clearInterval(fetchTimer);
	// 	};
	// }, [todos]);

	return (
		<div className={s.wrapper}>
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

export default TodoPage;
