import classes from './Input.module.css';
import {FC} from "react";
import {joinStyles} from "../../../../utils/utils";

interface InputProps {
	placeholder: string
	label: string
	error?: string
	empty?: boolean
	value: string
	setValue: (value: string) => void
	password?: boolean
	email?: boolean
	extraClasses?: string
}

const Input: FC<InputProps> = (
	{
		placeholder,
		label,
		error,
		empty=true,
		value,
		setValue,
		password,
		email,
		extraClasses = ""
	}
) => {

	const getType = () => {
		if (password) {
			return 'password'
		}
		if (email) {
			return 'email'
		}
		return 'text'
	}

	return (
		<>
			<div className={joinStyles(classes.container, extraClasses)}>
				<label className={classes.label}>
					{label}
				</label>
				<input
					onChange={
						(e) => {
							setValue(e.target.value)
						}
					}
					placeholder={placeholder}
					className={classes.input}
					type={getType()}
					value={value}
				/>
				{
					error && !empty && (
						<p className={classes.error}>{error}</p>
					)
				}
			</div>
		</>
	);
};

export default Input;