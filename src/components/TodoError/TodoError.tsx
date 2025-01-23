import { ReactNode, FC } from "react";

const TodoError: FC = (): ReactNode => {
	const validationStyle = {
		color: "red",
		margin: "10px 10px",
		width: "50%",
	};

	return (
		<h3 style={validationStyle}>
			Задача должна содержать от 2 до 64 <hr /> символов и не иметь запрещённых
			символов
		</h3>
	);
};

export default TodoError;
