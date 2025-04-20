import {FC} from 'react';
import classes from "./Attention.module.css";
import Button from "../Button/Button.tsx";

interface ErrorProps {
	header: string
	message: string
	onClick: () => void
}

const Attention: FC<ErrorProps> = (
	{
		header,
		message,
		onClick
	}
) => {
	return (
		<div
			className={classes.messageContainer}
		>
			<h2>
				{header}
			</h2>
			<hr/>
			<p>{message}</p>
			<Button
				black
				onClick={onClick}
			>
				Продолжить
			</Button>
		</div>
	);
};

export default Attention;