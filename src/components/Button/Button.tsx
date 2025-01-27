import { ButtonHTMLAttributes, FC, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	className: string;
}

const Button: FC<ButtonProps> = ({
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

export default Button;
