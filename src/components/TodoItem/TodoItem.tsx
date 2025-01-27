import { FC, ReactNode, useState } from "react";
import { FaPenToSquare, FaTrashCan, FaCheck, FaXmark } from "react-icons/fa6";

import { completeTodo, deleteTodo } from "../../api/api.ts";
import Button from "../Button/Button.tsx";
import TodoError from "../TodoError/TodoError.tsx";
import s from "./TodoItem.module.scss";

interface TodoItemProps {
	id: number;
	title: string;
	isDone: boolean;
	fetchTodos: () => void;
}

const TodoItem: FC<TodoItemProps> = ({
	id,
	title,
	isDone,
	fetchTodos,
}): ReactNode => {
	const [editedTitle, setEditedTitle] = useState<string>(title);
	const [error, setError] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);

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

	const handleClickEdit = () => {
		setIsEdit(true);
	};

	const handleCancelClick = () => {
		setIsEdit(false);
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
				setIsEdit(false);
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

			{isEdit ? (
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
					{error && <TodoError className={s.validation} />}
				</div>
			) : (
				<h3 style={isDone ? completedStyles : undefined} className={s.todoText}>
					{title}
				</h3>
			)}

			{isEdit ? (
				<div className={s.btnGroup}>
					<Button
						onClick={() => handleAcceptEdit(id, editedTitle)}
						className={s.rewriteBtn}
					>
						<FaCheck className={s.btnIcon} />
					</Button>
					<Button onClick={handleCancelClick} className={s.deleteBtn}>
						<FaXmark className={s.btnIcon} />
					</Button>
				</div>
			) : (
				<div className={s.btnGroup}>
					<Button onClick={handleClickEdit} className={s.rewriteBtn}>
						<FaPenToSquare className={s.btnIcon} />
					</Button>
					<Button onClick={() => handleClickDelete(id)} className={s.deleteBtn}>
						<FaTrashCan className={s.btnIcon} />
					</Button>
				</div>
			)}
		</li>
	);
};

export default TodoItem;
