import classes from './List.module.css'
import {FC, ReactNode} from "react";
import AvatarPlaceholder from "../AvatarPlaceholder/AvatarPlaceholder.tsx"
import {ChatResponse} from "../../../../types/schemas/chat.ts";
import {MessageExtendedResponse} from "../../../../types/schemas/message.ts";

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
}


export const ChatEntry: FC<ChatEntryProps> = (
	{
		type,
		title,
		interlocutor,
		onClick
	}
) => {

	return (
		<div
			onClick={onClick}
			className={classes.chatEntry}
		>
			{
				type == "PRIVATE" &&
				(
					<>
						<AvatarPlaceholder
							firstName={interlocutor.firstName}
							lastName={interlocutor.lastName}
						/>
						<div className={classes.userInitialText}>
							{`${interlocutor.firstName} ${interlocutor.lastName}`}
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
