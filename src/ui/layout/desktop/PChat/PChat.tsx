import classes from "./PChat.module.css"
import ChatView from "../../../component/Shared/ChatView/ChatView.tsx";
import ChatBar from "../../../component/Shared/ChatBar/ChatBar.tsx";
import {useEffect, useState} from "react";
import {MessageExtendedResponse} from "../../../../types/schemas/message.ts";
import {useFetching} from "../../../../hooks/useFetching.ts";
import {ChatResponse} from "../../../../types/schemas/chat.ts";
import {getChats} from "../../../../api/routes/chat.ts";
import {getLastMessages} from "../../../../api/routes/message.ts";
import {MyIdResponse, UserResponse} from "../../../../types/schemas/user.ts";
import {getMyId} from "../../../../api/routes/user.ts";
import {useStompClient} from "react-stomp-hooks";
import {NewMessageEvent} from "../../../../types/events/message.ts";
import {NewChatEvent} from "../../../../types/events/chat.ts";

const PChat = () => {
	const stompClient = useStompClient();

	const [chats, setChats] = useState<ChatResponse[]>([]);
	const [messages, setMessages] = useState<MessageExtendedResponse[]>([]);

	const [choosedChat, setChoosedChat] = useState<ChatResponse | null>(null)
	const [choosedUser, setChoosedUser] = useState<UserResponse | null>(null)

	const [myId, setMyId] = useState<number | null>(null);

	const [fetchChats] = useFetching(async () => {
			const fetchedChats: ChatResponse[] = await getChats();
			setChats([...fetchedChats])
		}
	)

	const [fetchLastMessages] = useFetching(async () => {
			const fetchedMessages: MessageExtendedResponse[] = await getLastMessages();
			setMessages([...messages, ...fetchedMessages])
		}
	)

	const [fetchMyId] = useFetching(async () => {
			const myIdResp: MyIdResponse = await getMyId();

			setMyId(myIdResp.id)
		}
	)

	const onNewMessage = (event: NewMessageEvent) => {
		setMessages((prevMessages) => {
			return [...prevMessages, event.message];
		});

	}

	const onNewChat = (event: NewChatEvent) => {

		setChats((prevChats) => {
			return [...prevChats, event.chat];
		});

		if (event.chat.type === "PRIVATE" && event.chat.interlocutor.id === choosedUser!.id) {
			setChoosedChat(event.chat)
			setChoosedUser(null)
		}
	}

	useEffect(() => {
		fetchChats().then()
		fetchLastMessages().then()
		fetchMyId().then()
	}, []);


	useEffect(() => {
		console.log(messages)
	}, [messages]);

	useEffect(() => {
		if (myId === null) {
			return;
		}

		if (stompClient === undefined) {
			return;
		}

		stompClient.subscribe(
			"/queue/user" + myId,
			(event) => {
				const json = JSON.parse(event.body)

				if (json.type === undefined) {
					return
				}
				if (json.type === "NewMessage") {
					onNewMessage(json)
				}
				if (json.type === "NewChat") {
					onNewChat(json)
				}
				else {
					console.log(json)
				}

			}
		)

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
				onChatChoose={(chat: ChatResponse | null) => setChoosedChat(chat)}
				onUserChoose={(user: UserResponse | null) => setChoosedUser(user)}
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
			/>
		</div>
	);
};

export default PChat;