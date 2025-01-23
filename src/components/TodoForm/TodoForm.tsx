import { FC, FormEvent, ReactNode, useState } from "react";

import { addNewTodo } from "../../api/api.ts";
import TodoError from "../TodoError/TodoError.tsx";
import s from "./TodoForm.module.scss";

interface TodoFormProps {
	fetchTodos: () => void;
}

const TodoForm: FC<TodoFormProps> = ({ fetchTodos }): ReactNode => {
	const [value, setValue] = useState<string>("");
	const [error, setError] = useState<boolean>(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const trimTitle = value.trim();
			const regex = /^[a-zA-Z0-9а-яА-ЯёЁ.,!?() ]{2,64}$/;
			if (!regex.test(trimTitle)) {
				setError(true);
			} else {
				await addNewTodo({ title: value, isDone: false });
				await fetchTodos();
				setValue("");
				setError(false);
			}
		} catch (e) {
			console.log("Cant add new todo", e);
		}
	};

	return (
		<div className={s.formWrapper}>
			<form onSubmit={handleSubmit} className={s.form}>
				<input
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className={s.input}
					type="text"
					placeholder="Task To Be Done..."
				/>
				<button type="submit" className={s.button}>
					Add
				</button>
			</form>
			{error && <TodoError />}
		</div>
	);
};

export default TodoForm;
