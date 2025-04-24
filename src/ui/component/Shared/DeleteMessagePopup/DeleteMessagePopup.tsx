import {MessageExtendedResponse} from "../../../../types/schemas/message.ts";
import {FC, useContext} from "react";
import {AuthContext} from "../../../../context/contexts.tsx";
import classes from './DeleteMessagePopup.module.css'
import Button from "../Button/Button.tsx";
import {deleteMessage} from "../../../../api/messaging/message.ts";
import {useStompClient} from "react-stomp-hooks";

interface DeleteMessagePopupProps {
	message: MessageExtendedResponse
	onCancel: () => void
}

const DeleteMessagePopup: FC<DeleteMessagePopupProps> = (
	{
		message,
		onCancel
	}
) => {

	const {userId} = useContext(AuthContext)

	const client = useStompClient();

	const onDeleteAll = () => {
		if (client === null || client === undefined) {
			return
		}
		deleteMessage(
			client,
			message.id,
			true
		)
		onCancel()
	}

	const onDeleteMine = () => {
		if (client === null || client === undefined) {
			return
		}
		deleteMessage(
			client,
			message.id,
			false
		)
		onCancel()
	}

	return (
		<div
			className={classes.dimmer}
			onClick={() => {
				onCancel()
			}}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className={classes.popup}>
				<span>{`Вы уверены что хотите удалить сообщение "${message.text}"?`}</span>
				<div className={classes.horizontalContainer}>
					<Button onClick={onDeleteMine}>Удалить у меня</Button>
					{
						message.user.id === userId && (
							<Button onClick={onDeleteAll}>Удалить у всех</Button>
						)
					}
				</div>
				<Button onClick={onCancel} black>Отмена</Button>
			</div>
		</div>
	);
};

export default DeleteMessagePopup;