import SearchBar from "../SearchBar/SearchBar.tsx";
import ChatList from "../ChatList/ChatList.tsx";
import classes from "./ChatBar.module.css"

const ChatBar = () => {
	return (
		<div className={classes.chatBar}>
			<SearchBar></SearchBar>
			<ChatList></ChatList>
		</div>
	);
};

export default ChatBar;