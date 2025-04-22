import classes from "./PChat.module.css"
import ChatView from "../../../component/Shared/ChatView/ChatView.tsx";
import ChatBar from "../../../component/Shared/ChatBar/ChatBar.tsx";
import {useEffect, useRef, useState} from "react";
import {MessageExtendedResponse} from "../../../../types/schemas/message.ts";
import {useFetching} from "../../../../hooks/useFetching.ts";
import {ChatResponse} from "../../../../types/schemas/chat.ts";
import {getChats} from "../../../../api/routes/chat.ts";
import {getLastMessages} from "../../../../api/routes/message.ts";
import {MyIdResponse, UserResponse} from "../../../../types/schemas/user.ts";
import {getMyId} from "../../../../api/routes/user.ts";
import {connectWebsocket} from "../../../../api/routes/websocket.ts";
import {CompatClient} from "@stomp/stompjs";

const PChat = () => {

	const [chats, setChats] = useState<ChatResponse[]>([]);
	const [messages, setMessages] = useState<MessageExtendedResponse[]>([]);

	const [choosedChat, setChoosedChat] = useState<ChatResponse | null>(null)
	const [choosedUser, setChoosedUser] = useState<UserResponse | null>(null)

	const [myId, setMyId] = useState<number | null>(null);

	const [fetchChats, isChatsLoading, chatsError, resetChatsError] = useFetching(async () => {
			const fetchedChats: ChatResponse[] = await getChats();
			setChats([...fetchedChats])
		}
	)

	const [fetchLastMessages, isLastMessagesLoading, lastMessagesError, resetLastMessagesError] = useFetching(async () => {
			const fetchedMessages: MessageExtendedResponse[] = await getLastMessages();
			setMessages([...messages, ...fetchedMessages])
		}
	)

	const [fetchMyId, isMyIdLoading, myIdError, resetMyIdError] = useFetching(async () => {
			const myIdResp: MyIdResponse = await getMyId();

			setMyId(myIdResp.id)
		}
	)

	const [client, setClient] = useState<null | CompatClient>(null)

	useEffect(() => {
		fetchChats().then()
		fetchLastMessages().then()
		fetchMyId().then()
	}, []);

	useEffect(() => {
		if (myId === null) {
			return;
		}

		const client = connectWebsocket()


		client.onConnect = () => {
			setClient(client)

			client.subscribe(
				"/queue/user/" + myId,
				(e) => {
					console.log(e)
					console.log(e.body)
				}
			)

			console.log(client)
			console.log(client.connected)
		}


	}, [myId]);


	const getChatMessages = () => {
		const result: MessageExtendedResponse[] = []

		if (choosedChat === null) {
			return result;
		}

		messages.forEach(
			(message: MessageExtendedResponse) => {
				if (message.chatId === choosedChat.id) {
					result.push(message)
				}
			}
		)

		return result
	}


	return (
		<div className={classes.fullScreenContainer}>
			<ChatBar
				messages={messages}
				chats={chats}
				onChatChoose={(chat: ChatResponse) => setChoosedChat(chat)}
				onUserChoose={(user: UserResponse) => setChoosedUser(user)}
			/>
			<ChatView
				user={choosedUser}
				chat={choosedChat}
				messages={getChatMessages()}
				onBack={
					() => {
						setChoosedChat(null)
						setChoosedUser(null)
					}
				}
				client={client!}
			/>
		</div>
	);
};

export default PChat;