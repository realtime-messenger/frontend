import {FC} from 'react';
import classes from "./AvatarPlaceholder.module.css";
import {ONLINE_THRESHOLD} from "../../../../config.ts";


interface AvatarPlaceholderProps {
	firstName?: string
	lastName?: string
	title?: string
	isOnline?: boolean
}

const AvatarPlaceholder: FC<AvatarPlaceholderProps> = (
	{
		firstName,
		lastName,
		title,
		isOnline
	}
) => {

	const getText = () => {
		if (title !== undefined) {
			return title[0].toUpperCase()
		}
		else {
			return (firstName![0] + lastName![0]).toUpperCase();
		}
	}

	return (
		<div className={classes.avatarPlaceholder}>
			{getText()}
			{
				isOnline && (
					<div className={classes.onlineIndicator}/>
				)
			}
		</div>
	)

}

export default AvatarPlaceholder;