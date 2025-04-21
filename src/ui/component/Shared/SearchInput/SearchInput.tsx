import {FC} from 'react';
import classes from "./SearchInput.module.css";


interface SearchInputProps {
	onFocus: () => void
	onBlur: () => void
	value: string,
	setValue: (value: string) => void
}

const SearchInput: FC<SearchInputProps> = (
	{
		onFocus,
		onBlur,
		value,
		setValue
	}
) => {
	return (
		<input
			className={classes.input}
			placeholder={"Начните вводить для поиска"}
			value={value}
			onChange={
				(e) => {
					setValue(e.target.value)
				}
			}
			type="text"
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	);
};

export default SearchInput;