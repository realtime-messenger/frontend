import classes from "./ChatView.module.css"
import {ChatResponse} from "../../../../types/schemas/chat.ts";
import {MessageExtendedResponse} from "../../../../types/schemas/message.ts";
import {UserResponse} from "../../../../types/schemas/user.ts";
import {FC, useContext, useEffect, useState} from "react";
import {sendMessageChat, sendMessagePrivate} from "../../../../api/messaging/sendMessage.ts";
import {CompatClient} from "@stomp/stompjs";



// Если выбран уже существующий чат то используется chat и messages
// Если выбрал user то при отправке сообщения будет создан новый чат и соответственно будет получен ивент о создании нового чата
// Вне chat view нужно замечать что новый чат - приватный и interlocutor в нём - это пользователь user и использовать этот чат
// по основному сценарию


interface TopBarProps {
	title: string,
	onBack: () => void
}
const TopBar: FC<TopBarProps> = (
	{
		title,
		onBack
	}
) => {


	return (
		<div className={classes.topBar}>
			<span
				onClick={onBack}
				className={classes.backSpan}>
				{
					"< Назад"
				}
			</span>
			{title}
		</div>
	)
}


interface TextMessageInputProps {
	onSend: (value: string) => void
}
const TextMessageInput: FC<TextMessageInputProps> = (
	{
		onSend
	}
) => {

	const [text, setText] = useState<string>("");

	return (
		<div className={classes.messageInput}>
			<input
				onChange={
					(e) => {
						setText(e.target.value)
					}
				}
				value={text}
				type="text"
				placeholder={"Лучшее время для письма - сейчас..."}
			/>
			<button
				onClick={
					() => {
						console.log("ASDASDASDASDASD")
						onSend(text)
						setText("")
					}
				}
			>
				{">"}
			</button>
		</div>
	)
}

interface MessagesProps {
	messages?: MessageExtendedResponse[] | null
}

const Messages: FC<MessagesProps> =  (
	{
		messages
	}
) => {


	return (
		<div className={classes.messagesView}>
			{
				messages?.map(
					(message: MessageExtendedResponse) =>  (
						<div>{message.text}</div>
					)
				)
			}
		</div>
	)
}


interface ChatViewProps {
	user: UserResponse | null
	chat: ChatResponse | null
	messages: MessageExtendedResponse[] | null
	onBack: () => void
	client: CompatClient
}

const ChatView: FC<ChatViewProps> = (
	{
		user,
		chat,
		messages,
		onBack,
		client
	}
) => {

	const getTitle = () => {
		if (chat !== null) {
			return chat.title
		}
		else if (user !== null) {
			return `${user.firstName} ${user.lastName}`
		}
		return ''
	}

	const onSend = (text: string) => {
		console.log("SENDING FUCIKNG MESSAGE")

		console.log(client.connected)

		if (client === null) {
			console.log("CLIENT APPREARED TO BE NULL")
			return
		}

		if (user !== null) {
			console.log("GONNA SEND MESSSAGE")
			sendMessagePrivate(
				client,
				user.id,
				text
			)
		}
		if (chat !== null) {
			console.log("GONNA SEND MESSSAGE")
			sendMessageChat(
				client,
				chat.id,
				text
			)
		}
	}

	useEffect(() => {
		console.log(client)
	}, []);

	const renderChatView = () => (
		<>
			<TopBar
				title={getTitle()}
				onBack={onBack}
			/>
			{
				user !== null &&
				(
					<>
						<Messages/>
					</>
				)
			}
			{
				chat !== null &&
				(
					<>
						<Messages messages={messages}/>
					</>
				)
			}
			<TextMessageInput
				onSend={
					(text) => onSend(text)
				}
			></TextMessageInput>
		</>
	)

	const renderPlaceholder = () => (
		<>
			<div className={classes.placeholder}>
				{"Выберите один из доступных чатов или начните новый чат с другим пользователем!"}
			</div>
		</>
	)


	return (
		<div className={classes.chatView}>
			{
				user !== null || chat !== null ?
					renderChatView() :
					renderPlaceholder()
			}
		</div>
	)
};

export default ChatView;