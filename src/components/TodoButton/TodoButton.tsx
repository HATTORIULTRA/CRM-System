import { FC, ReactNode } from "react";
import { IButton } from "../../types/types.ts";

const TodoButton: FC<IButton> = ({
	children,
	className,
	onClick,
}): ReactNode => {
	return (
		<button onClick={onClick} className={className}>
			{children}
		</button>
	);
};

export default TodoButton;
