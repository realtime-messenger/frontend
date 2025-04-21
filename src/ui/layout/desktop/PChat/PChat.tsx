import classes from "./PChat.module.css"
import ChatView from "../../../component/Shared/ChatView/ChatView.tsx";
import ChatBar from "../../../component/Shared/ChatBar/ChatBar.tsx";

const PChat = () => {
	return (
		<div className={classes.fullScreenContainer}>
			<ChatBar></ChatBar>
			<ChatView></ChatView>
		</div>
	);
};

export default PChat;