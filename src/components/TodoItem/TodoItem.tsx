import { FC, ReactNode, useState } from "react";
import { List, Checkbox, Button, Input, Form } from "antd";
import { FaPenToSquare, FaTrashCan, FaCheck, FaXmark } from "react-icons/fa6";

import { completeTodo, deleteTodo } from "../../api/todosAPI.ts";
import { Todo, TodoInfo } from "../../types/apiTypes.ts";
import s from "./TodoItem.module.scss";

interface TodoItemProps {
	item: Todo;
	fetchTodos: () => void;
}

const TodoItem: FC<TodoItemProps> = ({ item, fetchTodos }): ReactNode => {
	const { id, title, isDone } = item;
	const [form] = Form.useForm();
	const [isEdit, setIsEdit] = useState<boolean>(false);

	const handleClickDelete = async (id: number) => {
		try {
			await deleteTodo(id);
			await fetchTodos();
		} catch (error) {
			console.log("Cant delete todo", error);
		}
	};

	const handleClickComplete = async (id: number, isDone: boolean) => {
		try {
			await completeTodo(id, { title, isDone: !isDone });
			await fetchTodos();
		} catch (error) {
			console.log("Cant delete todo", error);
		}
	};

	const handleClickEdit = () => {
		setIsEdit(true);
	};

	const handleCancelClick = () => {
		setIsEdit(false);
	};

	const onFinish = async (values: TodoInfo) => {
		try {
			await completeTodo(id, { ...values, isDone });
			await fetchTodos();
			setIsEdit(false);
		} catch (error) {
			console.log("Cant update todos text", error);
		}
	};

	const completedStyles = {
		color: "darkgrey",
		textDecoration: "line-through",
	};

	return (
		<List.Item className={s.wrapper}>
			<Checkbox
				defaultChecked={isDone}
				onChange={() => handleClickComplete(id, isDone)}
			/>

			{isEdit ? (
				<Form
					className={s.form}
					form={form}
					name="editForm"
					layout="inline"
					autoComplete="off"
					onFinish={onFinish}
				>
					<Form.Item
						name="title"
						rules={[
							{
								required: true,
								message: "Введите название todo!",
							},
							{
								min: 2,
								message: "Количество символов должно быть больше 2!",
							},
							{
								max: 64,
								message: "Количество символов должно быть меньше 64!",
							},
							{
								whitespace: true,
								message: "Название не может состоять из пробелов!",
							},
							{
								pattern: /^[A-Za-z0-9\s\-_,\.;:()]+$/,
								message: "Только латинские буквы и цифры!",
							},
						]}
					>
						<Input
							className={s.editInput}
							type="title"
							placeholder="new title"
							autoFocus
						/>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit">
							<FaCheck />
						</Button>
					</Form.Item>
					<Form.Item>
						<Button onClick={handleCancelClick} color="danger" variant="solid">
							<FaXmark />
						</Button>
					</Form.Item>
				</Form>
			) : (
				<h3 style={isDone ? completedStyles : undefined} className={s.todoText}>
					{title}
				</h3>
			)}

			{!isEdit && (
				<div>
					<Button onClick={handleClickEdit} type="primary" className={s.button}>
						<FaPenToSquare />
					</Button>
					<Button
						onClick={() => handleClickDelete(id)}
						color="danger"
						variant="solid"
						className={s.button}
					>
						<FaTrashCan />
					</Button>
				</div>
			)}
		</List.Item>
	);
};

export default TodoItem;
