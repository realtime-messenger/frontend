import classes from "./SearchBar.module.css"
import Input from "../Input/Input.tsx";
import SearchInput from "../SearchInput/SearchInput.tsx";
import {useState} from "react";

const SearchBar = () => {

	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [searchPrompt, setSearchPrompt] = useState<string>("");

	return (
		<div className={classes.searchBar}>
			<SearchInput
				onFocus={() => setIsSearching(true)}
				onBlur={() => setIsSearching(false)}
				value={searchPrompt}
				setValue={(value) => setSearchPrompt(value)}
			/>
		</div>
	);
};

export default SearchBar;