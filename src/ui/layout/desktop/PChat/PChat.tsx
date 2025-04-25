import classes from "./PChat.module.css"
import ChatView from "../../../component/Shared/ChatView/ChatView.tsx";
import ChatBar from "../../../component/Shared/ChatBar/ChatBar.tsx";
import {useContext, useEffect, useState} from "react";
import {MessageExtendedResponse} from "../../../../types/schemas/message.ts";
import {useFetching} from "../../../../hooks/useFetching.ts";
import {ChatResponse} from "../../../../types/schemas/chat.ts";
import {getChats} from "../../../../api/routes/chat.ts";
import {getLastMessages, getMessages} from "../../../../api/routes/message.ts";
import {UserResponse} from "../../../../types/schemas/user.ts";
import {useStompClient} from "react-stomp-hooks";
import {DeleteMessageEvent, NewMessageEvent} from "../../../../types/events/message.ts";
import {NewChatEvent} from "../../../../types/events/chat.ts";
import {AuthContext} from "../../../../context/contexts.tsx";
import {DeleteReactionEvent, NewReactionEvent} from "../../../../types/events/reaction.ts";
import {ReactionResponse} from "../../../../types/schemas/reactions.ts";

const PChat = () => {
	const stompClient = useStompClient();

	const [chats, setChats] = useState<ChatResponse[]>([]);
	const [messages, setMessages] = useState<MessageExtendedResponse[]>([]);

	const [choosedChat, setChoosedChat] = useState<ChatResponse | null>(null)
	const [choosedUser, setChoosedUser] = useState<UserResponse | null>(null)

	const {userId} = useContext(AuthContext)

	const [fetchChats] = useFetching(async () => {
			const fetchedChats: ChatResponse[] = await getChats();
			console.log('i have just fetched chats')
			setChats([...fetchedChats])
		}
	)

	const [fetchLastMessages] = useFetching(async () => {
			const fetchedMessages: MessageExtendedResponse[] = await getLastMessages();
		console.log('i have just fetched messeges')
			setMessages([...messages, ...fetchedMessages])
		}
	)

	const [fetchMessages] = useFetching(async (chatId: number, skip: number, limit: number) => {
			const fetchedMessages: MessageExtendedResponse[] = await getMessages(chatId, skip, limit);
			setMessages([...messages, ...fetchedMessages])
		}
	)

 // ───────────────────────────────── Event Processors ─────────────────────────────────

	const onNewMessage = (event: NewMessageEvent) => {
		setMessages((prevMessages) => {
			return [...prevMessages, event.message];
		});

	}

	const onNewChat = (event: NewChatEvent) => {
		setChats((prevChats) => {
			return [...prevChats, event.chat];
		});

		try {
			console.log(event.chat.type === "PRIVATE" && event.chat.interlocutor.id === choosedUser!.id)
		} catch (e) {
			console.log(e)
		}

		if (event.chat.type === "PRIVATE" && event.chat.interlocutor.id === choosedUser!.id) {
			setChoosedChat(event.chat)
			setChoosedUser(null)
		}
	}

	const onNewReaction = (event: NewReactionEvent) => {
		setMessages((prevMessages) => {
			const newMessages = structuredClone(prevMessages)
			newMessages.forEach(
				(message: MessageExtendedResponse) => {
					if (message.id === event.reaction.messageId) {
						message.reactions = [...message.reactions, event.reaction]
					}
				}
			)

			return newMessages;
		});
	}

	const onDeleteReaction = (event: DeleteReactionEvent) => {
		setMessages((prevMessages) => {
			const newMessages = structuredClone(prevMessages)
			newMessages.forEach(
				(message: MessageExtendedResponse) => {
					if (message.id === event.reaction.messageId) {
						const newReactions: ReactionResponse[] = []

						message.reactions.forEach(
							(reaction: ReactionResponse) => {
								if (reaction.id !== event.reaction.id) {
									newReactions.push(reaction)
								}
							}
						)

						message.reactions = newReactions
					}
				}
			)

			return newMessages;
		});
	}

	const onDeleteMessage = (event: DeleteMessageEvent) => {
		setMessages((prevMessages) => {
			const newMessages: MessageExtendedResponse[] = []

			prevMessages.forEach(
				(message: MessageExtendedResponse) => {
					if (message.id !== event.messageId) {
						newMessages.push(message)
					}
				}
			)

			return newMessages
		})
	}

	// ───────────────────────────────── Event Processors ─────────────────────────────────


	useEffect(() => {
		fetchChats().then()
		fetchLastMessages().then()
	}, []);


	useEffect(() => {
		if (stompClient === undefined) {
			return;
		}

		stompClient.subscribe(
			"/topic/user" + userId,
			(event) => {
				const parsedEvent = JSON.parse(event.body)

				if (parsedEvent.type === undefined) {
					return
				}

				switch (parsedEvent.type) {
					case "NewMessage":
						onNewMessage(parsedEvent)
						break;
					case "NewChat":
						onNewChat(parsedEvent)
						break;
					case "NewReaction":
						onNewReaction(parsedEvent)
						break;
					case "DeleteReaction":
						onDeleteReaction(parsedEvent)
						break;
					case "DeleteMessage":
						onDeleteMessage(parsedEvent)
						break;
					default:
						console.log(parsedEvent)
				}
			}
		)

	}, [stompClient]);


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
				choosedChatId={choosedChat?.id}
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
				onLoadPrevious={
					(chatId: number, skip: number, limit: number) => {
						fetchMessages(chatId, skip, limit)
					}
				}
			/>
		</div>
	);
};

export default PChat;