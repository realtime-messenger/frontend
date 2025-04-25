import classes from './List.module.css'
import {FC, ReactNode, useContext, useEffect, useState} from "react";
import AvatarPlaceholder from "../AvatarPlaceholder/AvatarPlaceholder.tsx"
import {ChatResponse} from "../../../../types/schemas/chat.ts";
import {MessageExtendedResponse} from "../../../../types/schemas/message.ts";
import {AuthContext} from "../../../../context/contexts.tsx";
import {useStompClient} from "react-stomp-hooks";
import {joinStyles} from "../../../../utils/utils.ts";

interface UserEntryProps {
	firstName: string
	lastName: string
	onClick: () => void
}

export const UserEntry: FC<UserEntryProps> = (
	{
		firstName,
		lastName,
		onClick
	}
) => {

	return (
		<div
			onClick={onClick}
			className={classes.chatEntry}>
			<AvatarPlaceholder
				firstName={firstName}
				lastName={lastName}
			/>
			<div className={classes.userInitialText}>
				{`${firstName} ${lastName}`}
			</div>
		</div>
	)
}


interface ChatEntryProps extends ChatResponse {
	lastMessage: MessageExtendedResponse | null
	onClick: () => void
	active: boolean
}


export const ChatEntry: FC<ChatEntryProps> = (
	{
		id,
		type,
		title,
		interlocutor,
		onClick,
		lastMessage,
		active
	}
) => {
	const {userId} = useContext(AuthContext)

	const stompClient = useStompClient();

	const getSpanText = () => {
		let result = ""
		if (userId === lastMessage?.user.id) {
			result += "Вы: "
		}
		else {
			result += `${lastMessage?.user.firstName}: `
		}
		result += lastMessage?.text
		return result
	}

	const getChatEntryClasses = () => {
		const result = [classes.chatEntry]

		if (active) {
			result.push(classes.active)
		}

		return joinStyles(...result)
	}

	const [userTyping, setUserTyping] = useState(false);

	const [online, setOnline] = useState(false)

	// ───────────────────────────────── Event Processors ─────────────────────────────────

	useEffect(() => {
		if (stompClient === undefined) {
			return;
		}

		stompClient.subscribe(
			"/topic/chat" + id,
			(event) => {
				const parsedEvent = JSON.parse(event.body)

				if (parsedEvent.type === undefined) {
					return
				}
				switch (parsedEvent.type) {
					case "UserTyping":
						console.log(parsedEvent)
						break;
					default:
						console.log(parsedEvent)
				}
			}
		)

		if (type !== "PRIVATE") {
			return;
		}

		stompClient.subscribe(
			"/topic/user-online" + interlocutor.id,
			(event) => {
				const parsedEvent = JSON.parse(event.body)

				if (parsedEvent.type === undefined) {
					return
				}

				switch (parsedEvent.type) {
					case "UserOnline":
						setOnline(true)
						break;
					case "UserOffline":
						setOnline(false)
						break;
					default:
						console.log(parsedEvent)
				}
			}
		)
	}, [stompClient]);


	return (
		<div
			onClick={onClick}
			className={getChatEntryClasses()}
		>
			{
				type == "PRIVATE" &&
				(
					<>
						<AvatarPlaceholder
							firstName={interlocutor.firstName}
							lastName={interlocutor.lastName}
							isOnline={online}
						/>

						<div className={classes.verticalContainer}>
							<div className={classes.userInitialText}>
								{`${interlocutor.firstName} ${interlocutor.lastName}`}
							</div>
							<span>
								{getSpanText()}
							</span>
						</div>
					</>
				)
			}
			{
				type == "PUBLIC" &&
				(
					<>
						<AvatarPlaceholder
							title={title}
						/>
						<div className={classes.userInitialText}>
							{`${title}`}
						</div>
					</>
				)
			}
		</div>
	)
}


interface ListProps {
	children: ReactNode
}

export const UserList: FC<ListProps> = (
	{
		children
	}
) => {
	return (
		<div className={classes.chatList}>
			{children}
		</div>
	);
};


export const ChatList: FC<ListProps> = (
	{
		children
	}
) => {
	return (
		<div className={classes.chatList}>
			{children}
		</div>
	);
};
