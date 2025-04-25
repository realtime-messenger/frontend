import classes from "./ChatView.module.css"
import {ChatResponse} from "../../../../types/schemas/chat.ts";
import {MessageExtendedResponse} from "../../../../types/schemas/message.ts";
import {UserResponse} from "../../../../types/schemas/user.ts";
import {FC, useEffect, useRef, useState} from "react";
import {sendMessageChat, sendMessagePrivate} from "../../../../api/messaging/message.ts";
import {useStompClient} from "react-stomp-hooks";
import Message from "../Message/Message.tsx";
import ReactionPopup from "../ReactionPopup/ReactionPopup.tsx";
import {setReaction} from "../../../../api/messaging/reaction.ts";
import DeleteMessagePopup from "../DeleteMessagePopup/DeleteMessagePopup.tsx";
import {useMessageSort} from "../../../../hooks/useSorting.ts";


// ────────────────────────────────────── Top Bar ──────────────────────────────────────
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

// ─────────────────────────────────── Message Input ───────────────────────────────────
interface TextMessageInputProps {
	onSend: (value: string) => void
}
const TextMessageInput: FC<TextMessageInputProps> = (
	{
		onSend
	}
) => {

	const [text, setText] = useState<string>("");

	const onSubmit = () => {
		onSend(text)
		setText("")
	}

	const getButtonClasses = () => {
		if (text === "") {
			return classes.buttonDisabled
		}
		return ""
	}

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
				onKeyDown={
					(e) => {
						if (e.code == "Enter") {
							onSubmit()
						}
					}
				}
			/>
			<button
				onClick={
					() => onSubmit()
				}
				disabled={text == ""}
				className={getButtonClasses()}
			>
				{">"}
			</button>
		</div>
	)
}

// ──────────────────────────────── List With Messages ─────────────────────────────────
interface MessagesProps {
	chat?: ChatResponse | null
	messages?: MessageExtendedResponse[] | null
	onLoadPrevious?: (chatId: number, skip: number, limit: number) => void | null
}

interface PosType {
	x: number
	y: number
}


const Messages: FC<MessagesProps> =  (
	{
		messages,
		onLoadPrevious,
		chat
	}
) => {

	const client = useStompClient();


	const [menuOpen, setMenuOpen] = useState<boolean>(false)
	const [pos, setPos] = useState<PosType>({x: 0, y: 0})

	const [choosedMessageId, setChoosedMessageId] = useState<number | null>(null)

	const [messageToDelete, setMessageToDelete] = useState<MessageExtendedResponse | null>(null)

	const sortedMessages = useMessageSort(messages)

	const onReactionChoose = (reaction: string) => {
		if (client === undefined) {
			return;
		}
		if (client === null) {
			return
		}

		setReaction(
			client,
			choosedMessageId!,
			reaction
		)
	}

	const divRef = useRef(null);

	useEffect(() => {
		divRef.current.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);


	return (
		<>
			<div className={classes.messagesView}>
			<span
				onClick={() => {
					if (onLoadPrevious !== null && onLoadPrevious !== undefined) {
						onLoadPrevious(chat!.id, sortedMessages!.length, 20)
					}
				}}
				className={classes.loadPrevious}>
				{"Загрузить предыдущие сообщения"}
			</span>
				{
					sortedMessages?.map(
						(message: MessageExtendedResponse) =>  (
							<Message
								key={message.id}
								user={message.user}
								isRead={message.isRead}
								dateCreated={message.dateCreated}
								text={message.text}
								reactions={message.reactions}
								onContextMenu={
									(e) => {
										e.preventDefault()
										e.stopPropagation()
										setPos(
											{
												x: e.pageX,
												y: e.pageY
											}
										)
										setMenuOpen(true)
										setChoosedMessageId(message.id)
									}
								}
								onLongPress={
									() => {
										setMessageToDelete(message)
									}
								}
							/>
						)
					)
				}
				<div ref={divRef}/>
			</div>
			{
				menuOpen && (
					<ReactionPopup
						x={pos.x}
						y={pos.y}
						onReactionChoose={
							(reaction) => onReactionChoose(reaction)
						}
						onClose={
							() => setMenuOpen(false)
						}
					/>
				)
			}
			{
				messageToDelete !== null && (
					<DeleteMessagePopup
						message={messageToDelete}
						onCancel={() => setMessageToDelete(null)}
					/>
				)
			}
		</>
	)
}

// ───────────────────────────────────── Chat View ─────────────────────────────────────

interface ChatViewProps {
	user: UserResponse | null
	chat: ChatResponse | null
	messages: MessageExtendedResponse[] | null
	onBack: () => void
	onLoadPrevious: (chatId: number, skip: number, limit: number) => void
}

const ChatView: FC<ChatViewProps> = (
	{
		user,
		chat,
		messages,
		onBack,
		onLoadPrevious
	}
) => {

	const client = useStompClient();

	const getTitle = () => {
		if (chat !== null) {
			if (chat.type === "PRIVATE") {
				return `${chat.interlocutor.firstName} ${chat.interlocutor.lastName}`
			}
			else {
				return chat.title
			}
		}
		else if (user !== null) {
			return `${user.firstName} ${user.lastName}`
		}
		return ''
	}

	const onSend = (text: string) => {
		if (client === undefined) {
			return;
		}

		if (client === null) {
			return
		}

		if (user !== null) {
			sendMessagePrivate(
				client,
				user.id,
				text
			)
		}
		if (chat !== null) {
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
						<Messages
							chat={chat}
							messages={messages}
							onLoadPrevious={onLoadPrevious}
						/>
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