import classes from "./SearchBar.module.css"
import SearchInput from "../SearchInput/SearchInput.tsx";
import {FC} from "react";


interface SearchBarProps {
	setIsSearching: (value: boolean) => void
	searchPrompt: string
	setSearchPrompt: (value: string) => void
}

const SearchBar: FC<SearchBarProps> = (
	{
		setIsSearching,
		searchPrompt,
		setSearchPrompt
	}
) => {

	const processState = (focus: boolean) => {
		if (searchPrompt != '') {
			setIsSearching(true)
			return
		}
		setIsSearching(focus)
	}


	return (
		<div
			onKeyDown={
				(e) => {
					if (e.code === "Escape") {
						setSearchPrompt("")
						setIsSearching(false)
					}
				}
			}
			className={classes.searchBar}>
			<SearchInput
				onFocus={() => processState(true)}
				onBlur={() => processState(false)}
				value={searchPrompt}
				setValue={(value) => setSearchPrompt(value)}
			/>
		</div>
	);
};

export default SearchBar;