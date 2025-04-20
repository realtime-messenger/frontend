import {FC, ReactNode} from "react";
import classes from './Button.module.css';
import {joinStyles} from "../../../../utils/utils";

interface ButtonProps {
	children: ReactNode
	onClick: () => void,
	black?: boolean
	white?: boolean
	bold?: boolean
	extraClasses?: string
	disabled?: boolean
}

const Button: FC<ButtonProps> = (
	{
		children,
		onClick,
		black,
		white,
		bold,
		extraClasses = "",
		disabled = false
	}
) => {

	const getClasses = (): string => {
		const result = [classes.button]

		if (black) {
			result.push(classes.black)
		}
		if (white) {
			result.push(classes.white)
		}
		if (bold) {
			result.push(classes.bold)
		}

		return result.join(' ')
	}

	return (
		<>
			<div className={joinStyles(classes.container, extraClasses)}>
				<button
					disabled={disabled}
					onClick={onClick}
					className={getClasses()}
				>
					{children}
				</button>
			</div>
		</>
	);
};

export default Button;