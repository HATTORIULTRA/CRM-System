import { FC, ReactNode, useState } from "react";
import { FaPenToSquare, FaTrashCan, FaCheck, FaXmark } from "react-icons/fa6";

import { completeTodo, deleteTodo } from "../../api/api.ts";
import TodoButton from "../TodoButton/TodoButton.tsx";
import TodoError from "../TodoError/TodoError.tsx";
import s from "./TodoItem.module.scss";

interface TodoItemProps {
	id: number;
	title: string;
	isDone: boolean;
	fetchTodos: () => void;
	todoIdForEdit: number | null;
	setTodoIdForEdit: (id: number | null) => void;
}

const TodoItem: FC<TodoItemProps> = ({
	id,
	title,
	isDone,
	fetchTodos,
	todoIdForEdit,
	setTodoIdForEdit,
}): ReactNode => {
	const [editedTitle, setEditedTitle] = useState<string>(title);
	const [error, setError] = useState<boolean>(false);
	const editTodo = todoIdForEdit === id;

	const handleClickDelete = async (id: number) => {
		try {
			await deleteTodo(id);
			await fetchTodos();
		} catch (e) {
			console.log("Cant delete todo", e);
		}
	};

	const handleClickComplete = async (id: number, isDone: boolean) => {
		try {
			await completeTodo(id, { title, isDone: !isDone });
			await fetchTodos();
		} catch (e) {
			console.log("Cant delete todo", e);
		}
	};

	const handleClickEdit = (id: number) => {
		setTodoIdForEdit(id);
	};

	const handleCancelClick = () => {
		setTodoIdForEdit(null);
	};

	const handleAcceptEdit = async (id: number, newTitle: string) => {
		const trimTitle = newTitle.trim();
		const regex = /^[a-zA-Z0-9а-яА-ЯёЁ.,!?() ]{2,64}$/;
		if (!regex.test(trimTitle)) {
			setError(true);
		} else {
			try {
				await completeTodo(id, { title: trimTitle, isDone });
				await fetchTodos();
				setTodoIdForEdit(null);
			} catch (e) {
				console.log("Cant update todos text", e);
			}
		}
	};

	const completedStyles = {
		color: "darkgrey",
		textDecoration: "line-through",
	};

	return (
		<li className={s.todoItem}>
			<input
				onClick={() => handleClickComplete(id, isDone)}
				defaultChecked={isDone}
				className={s.checkbox}
				type="checkbox"
			/>

			{editTodo ? (
				<div className={s.editFormWrapper}>
					<input
						value={editedTitle}
						onChange={(e) => {
							setEditedTitle(e.target.value);
							setError(false);
						}}
						className={s.editInput}
						type="text"
						placeholder="new text"
						autoFocus
					/>
					{error && <TodoError />}
				</div>
			) : (
				<h3 style={isDone ? completedStyles : undefined} className={s.todoText}>
					{title}
				</h3>
			)}

			{editTodo ? (
				<div className={s.btnGroup}>
					<TodoButton
						onClick={() => handleAcceptEdit(id, editedTitle)}
						className={s.rewriteBtn}
					>
						<FaCheck className={s.btnIcon} />
					</TodoButton>
					<TodoButton onClick={handleCancelClick} className={s.deleteBtn}>
						<FaXmark className={s.btnIcon} />
					</TodoButton>
				</div>
			) : (
				<div className={s.btnGroup}>
					<TodoButton
						onClick={() => handleClickEdit(id)}
						className={s.rewriteBtn}
					>
						<FaPenToSquare className={s.btnIcon} />
					</TodoButton>
					<TodoButton
						onClick={() => handleClickDelete(id)}
						className={s.deleteBtn}
					>
						<FaTrashCan className={s.btnIcon} />
					</TodoButton>
				</div>
			)}
		</li>
	);
};

export default TodoItem;
