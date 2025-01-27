import { ReactNode, FC } from "react";

interface TodoErrorProps {
	className: string;
}

const TodoError: FC<TodoErrorProps> = ({ className }): ReactNode => {
	return (
		<p className={className}>
			Задача должна содержать от 2 до 64 символов и не иметь запрещённых
			символов
		</p>
	);
};

export default TodoError;
