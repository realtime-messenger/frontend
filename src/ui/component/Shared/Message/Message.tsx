import React, {FC, useContext} from 'react';
import classes from './Message.module.css'
import {UserResponse} from "../../../../types/schemas/user.ts";
import {joinStyles} from "../../../../utils/utils.ts";
import {ReactionResponse} from "../../../../types/schemas/reactions.ts";
import {AuthContext} from "../../../../context/contexts.tsx";
import {deleteReaction} from "../../../../api/messaging/reaction.ts";
import {useStompClient} from "react-stomp-hooks";


interface MessageProps {
	user: UserResponse
	dateCreated: string
	isRead: boolean
	text: string
	reactions: ReactionResponse[]
	onContextMenu: (e: React.MouseEvent<HTMLElement>) => void
}


const Message: FC<MessageProps> = (
	{
		user,
		dateCreated,
		isRead,
		text,
		reactions,
		onContextMenu
	}
) => {
	const client = useStompClient();

	const {userId} = useContext(AuthContext)

	const getMessageContainerClasses = () => {
		const result = [classes.messageContainer]

		if (user.id === userId) {
			result.push(classes.mine)
		}
		else {
			result.push(classes.foreign)
		}

		return joinStyles(...result)
	}

	const getIndicatorStyles = () => {
		const result = [classes.indicator]

		if (user.id !== userId) {
			result.push(classes.hidden)
		}
		else {
			if (!isRead) {
				result.push(classes.active)
			}
		}

		return joinStyles(...result)
	}

	const getReactionStyles = (reactionUserId: number) => {
		const result = [classes.reaction]

		if (reactionUserId === userId) {
			result.push(classes.active)
		}

		return joinStyles(...result)
	}

	const onReactionClick = (reaction: ReactionResponse) => {
		if (reaction.userId !== userId) {
			return
		}
		if (client === undefined) {
			return;
		}

		if (client === null) {
			return
		}
		deleteReaction(
			client,
			reaction.id
		)
	}

	return (
		<>
			<div className={getMessageContainerClasses()}>
				<div
					className={classes.message}
					onContextMenu={(e) => onContextMenu(e)}
				>
					<div className={classes.name}>
						<div className={getIndicatorStyles()}/>
						<span
							title={dateCreated}
						>
						{`${user.firstName} ${user.lastName}`}
					</span>
					</div>
					<span>
					{text}
				</span>
					<div className={classes.reactionContainer}>
						{
							reactions.map(
								(reaction: ReactionResponse) => (
									<div
										className={getReactionStyles(reaction.userId)}
										onClick={
											() => onReactionClick(reaction)
										}
									>
										{reaction.reaction}
									</div>
								)
							)
						}
					</div>
				</div>
			</div>



		</>
	);
};

export default Message;